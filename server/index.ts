import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, AccountRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { issueVirtualCard, processFiatPayout, verifyWebhookSignature as verifyFincraSignature } from './services/fincra';
import { processCryptoPayout, createLightningInvoice } from './services/bitnob';
import { AiIntelligenceService } from './services/ai.service';
import { IbanService } from './services/iban.service';
import { BillsService } from './services/bills.service';
import * as Maplerad from './services/maplerad';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'paypee_super_secret_dev_key';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Basic health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'live', service: 'paypee-core-api', timestamp: new Date() });
});

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

// ==========================================
// Authentication Routes
// ==========================================

app.post('/api/auth/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role, firstName, lastName, businessName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user internally with explicit data mapping
    const userRole = role.toUpperCase() as AccountRole;
    
    const userData: any = {
      email,
      passwordHash,
      role: userRole,
    };

    // Only assign optional fields if they are actually provided
    if (firstName && firstName.trim() !== "") userData.firstName = firstName;
    if (lastName && lastName.trim() !== "") userData.lastName = lastName;
    if (businessName && businessName.trim() !== "") userData.businessName = businessName;

    const user = await prisma.user.create({
      data: userData
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Issue token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role, kycStatus: user.kycStatus }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// ==========================================
// Protected User Data Routes
// ==========================================

app.get('/api/users/me', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        kycStatus: true, 
        firstName: true,
        lastName: true,
        businessName: true,
        createdAt: true 
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Fetch associated wallets
    let wallets = await prisma.wallet.findMany({ where: { userId: user.id } });

    // AUTO-SYNC: If any wallet is missing metadata, try to provision/patch it now
    const needsSync = wallets.some(w => !w.metadata);
    if (needsSync) {
       console.log(`🔄 Auto-syncing metadata for user ${user.id}...`);
       await Promise.all(wallets.map(w => {
          if (!w.metadata) {
             const name = user.businessName || `${user.firstName} ${user.lastName}`;
             return IbanService.provisionGlobalAccount(user.id, w.currency, name);
          }
          return Promise.resolve();
       }));
       // Refetch wallets after sync
       wallets = await prisma.wallet.findMany({ where: { userId: user.id } });
    }

    res.json({ ...user, wallets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// ==========================================
// Virtual Card Management
// ==========================================

app.post('/api/cards/:cardId/toggle-freeze', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
      const { cardId } = req.params;
      const card = await prisma.virtualCard.findUnique({ where: { id: cardId } });
      
      if (!card || card.userId !== req.user.userId) return res.status(404).json({ error: 'Card not found' });

      const updatedCard = await prisma.virtualCard.update({
         where: { id: cardId },
         data: { status: card.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN' }
      });

      res.status(200).json({ message: `Card ${updatedCard.status === 'FROZEN' ? 'frozen' : 'activated'} successfully`, status: updatedCard.status });
   } catch (error) {
      res.status(500).json({ error: 'Failed to toggle card status' });
   }
});

app.get('/api/cards/:cardId/pin', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
      const { cardId } = req.params;
      const card = await prisma.virtualCard.findUnique({ where: { id: cardId } });
      
      if (!card || card.userId !== req.user.userId) return res.status(404).json({ error: 'Card not found' });

      // In production, you would fetch this from the provider (Marqeta/Lithic)
      res.status(200).json({ pin: '4491' }); 
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch PIN' });
   }
});

// ==========================================
// Virtual Cards Routes
// ==========================================

app.get('/api/cards', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const cards = await prisma.virtualCard.findMany({ 
      where: { userId: req.user.userId },
      include: { wallet: true }
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch virtual cards' });
  }
});

app.post('/api/cards', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { walletId } = req.body;
    
    // In a real system, you would call a card issuer API like Stripe or Fincra here
    // Attempt to issue real card via Fincra
    let cardNumber = "4242" + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    let cvv = Math.floor(Math.random() * 900 + 100).toString();
    let expiry = "12/28";

    if (process.env.FINCRA_SECRET_KEY) {
      try {
        const fincraCard = await issueVirtualCard(req.user.userId, 'USD');
        cardNumber = fincraCard.cardNumber || cardNumber;
        cvv = fincraCard.cvv || cvv;
        expiry = fincraCard.expiry || expiry;
      } catch (err) {
        console.warn('Fincra Card Error, falling back to simulation logic.', err);
      }
    }

    const card = await prisma.virtualCard.create({
      data: {
        userId: req.user.userId,
        walletId: walletId,
        cardNumber,
        expiry,
        cvv,
        status: "ACTIVE"
      }
    });
    
    res.status(201).json(card);
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({ error: 'Failed to issue virtual card' });
  }
});

// ==========================================
// Transactions Routes
// ==========================================

app.get('/api/transactions', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const transactions = await prisma.transaction.findMany({ 
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { amount, currency, type, walletId } = req.body;
    
    const reference = "TXN-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Verify wallet
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== req.user.userId) {
      return res.status(400).json({ error: 'Invalid wallet ID' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.userId,
        walletId,
        type,
        amount,
        currency,
        reference,
        status: "COMPLETED" // Marking completed immediately for mock MVP
      }
    });

    // External Gateway Routing (Fincra or Bitnob)
    if (type === 'WITHDRAWAL' || type === 'PAYOUT') {
       if (wallet.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
       
       if (currency === 'USD' && process.env.BITNOB_SECRET_KEY) {
         try {
           await processCryptoPayout(amount, req.body.destinationAddress || 'lightning_address');
         } catch (err) {
           console.warn('Bitnob failure:', err);
         }
       } else if (process.env.FINCRA_SECRET_KEY) {
         try {
           const destNumber = req.body.destinationAccount || '0123456789';
           const destBank = req.body.bankCode || '058';
           await processFiatPayout(amount, currency, { number: destNumber, bankCode: destBank });
         } catch (err) {
           console.warn('Fincra failure:', err);
         }
       }
       
       await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } }
      });
    } else if (type === 'DEPOSIT') {
       if (currency === 'USD' && process.env.BITNOB_SECRET_KEY) {
         // Could generate lightning invoice here
         await createLightningInvoice(amount, 'user@example.com').catch(console.warn);
       }
       await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: amount } }
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

// ==========================================
// Payouts (Maplerad Transfers) Routes
// ==========================================

app.get('/api/payouts/banks', authenticateToken, async (req: any, res: any) => {
  try {
    const currency = req.query.currency as string || 'NGN';
    const banks = await Maplerad.getBanks(currency);
    res.json(banks);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

app.post('/api/payouts/transfer', authenticateToken, async (req: any, res: any) => {
  try {
    const { amount, sourceCurrency, targetCurrency, bankCode, accountNumber, routingNumber, swiftCode, iban, walletId } = req.body;
    const userId = req.user.userId;
    const parsedAmount = parseFloat(amount); // This is the amount in sourceCurrency to deduct

    if (!walletId || !bankCode || !accountNumber || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid payout parameters' });
    }

    // Check balance
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.userId !== userId) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (parseFloat(wallet.balance.toString()) < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    let payoutAmount = parsedAmount;
    let payoutCurrency = sourceCurrency || wallet.currency;
    let fxRate = 1;

    // Check if auto-conversion is needed
    if (targetCurrency && targetCurrency !== payoutCurrency) {
      console.log(`[PAYOUT] Auto-converting ${parsedAmount} ${payoutCurrency} to ${targetCurrency}...`);
      
      // 1. Generate FX Quote (sourceAmount -> targetAmount)
      const quote = await Maplerad.generateFxQuote(payoutCurrency, targetCurrency, parsedAmount);
      const quoteRef = quote.reference || quote.id;
      payoutAmount = quote.target_amount ? quote.target_amount / 100 : 0;
      fxRate = quote.rate || 1;

      // 2. Execute FX Swap internally on Maplerad
      await Maplerad.executeFxSwap(quoteRef);
      payoutCurrency = targetCurrency;
      
      console.log(`[PAYOUT] FX Swap complete. Executing transfer of ${payoutAmount} ${payoutCurrency}`);
    } else {
      console.log(`[PAYOUT] Executing local transfer of ${parsedAmount} ${payoutCurrency}`);
    }

    // 3. Execute Maplerad Payout
    // Add extra international fields if they exist
    const accountDetails = {
      bankCode,
      number: accountNumber,
      routing_number: routingNumber,
      swift_code: swiftCode,
      iban: iban
    };

    const payoutResult = await Maplerad.processPayout(payoutAmount, payoutCurrency, accountDetails);

    // 4. Atomic DB update (Only deduct once, log the transfer)
    const reference = `PAYOUT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: parsedAmount } } // Always deduct the source amount
      }),
      prisma.transaction.create({
        data: {
          userId,
          walletId,
          type: 'WITHDRAWAL',
          amount: parsedAmount,
          currency: wallet.currency as any,
          status: 'COMPLETED',
          reference,
          category: 'TRANSFER',
          desc: `Transfer to ${accountNumber}`,
          metadata: {
            provider: 'MAPLERAD',
            providerReference: payoutResult?.id || null,
            bankCode,
            accountNumber,
            targetCurrency: payoutCurrency,
            targetAmount: payoutAmount,
            fxRate: fxRate
          }
        }
      })
    ]);

    res.status(200).json({ status: 'COMPLETED', reference, targetAmount: payoutAmount, targetCurrency: payoutCurrency });

  } catch (error: any) {
    console.error('[PAYOUT ERROR]', error.message);
    res.status(500).json({ error: error.message || 'Transfer failed' });
  }
});

// ==========================================
// Developer API Keys Routes
// ==========================================

app.get('/api/keys', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
     const keys = await prisma.apiKey.findMany({ 
       where: { userId: req.user.userId },
       select: { id: true, key: true, isLive: true, createdAt: true } // Exclude secretHash
     });
     res.json(keys);
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch API keys' });
   }
});

app.post('/api/keys', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
     const { isLive } = req.body;
     const rawSecret = require('crypto').randomBytes(32).toString('hex');
     const keyPrefix = isLive ? 'sk_live_' : 'sk_test_';
     const keyString = keyPrefix + require('crypto').randomBytes(16).toString('hex');

     const salt = await bcrypt.genSalt(10);
     const secretHash = await bcrypt.hash(rawSecret, salt);

     const newKey = await prisma.apiKey.create({
       data: {
         userId: req.user.userId,
         key: keyString,
         secretHash,
         isLive: isLive || false
       }
     });

     res.status(201).json({
       id: newKey.id,
       key: newKey.key,
       isLive: newKey.isLive,
       secret: rawSecret, // ONLY Return secret ONCE during creation
       createdAt: newKey.createdAt
     });
   } catch (error) {
     console.error('Create API key error:', error);
     res.status(500).json({ error: 'Failed to generate API key' });
   }
})

// ==========================================
// Webhook Handlers
// ==========================================

app.post('/api/webhooks/fincra', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('[FINCRA WEBHOOK RECEIVED]:', payload.event);
    
    // Handle successful payout reconciliation
    if (payload.event === 'payout.successful') {
       const reference = payload.data.reference;
       
       await prisma.transaction.update({
         where: { reference },
         data: { status: 'COMPLETED' }
       });
       
       console.log(`[RECONCILED]: Fincra Payout ${reference} marked as COMPLETED.`);
    }

    if (payload.event === 'payout.failed') {
       const reference = payload.data.reference;
       // Refund logic could go here
       await prisma.transaction.update({
         where: { reference },
         data: { status: 'FAILED' }
       });
    }

    res.status(200).send('Webhook Processed');
  } catch (error) {
    console.error('Fincra Webhook Error:', error);
    res.status(500).send('Webhook Error');
  }
});

app.post('/api/webhooks/bitnob', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('[BITNOB WEBHOOK RECEIVED]:', payload.event);
    
    // Handle Lightning Invoice Payment
    if (payload.event === 'invoice.success') {
       const { customerId, amount, currency } = payload.data;
       
       // 1. Find the user's wallet
       const user = await prisma.user.findFirst({
          where: { id: customerId } // Bitnob customerId mapped to Paypee userId
       });

        if (user) {
          const wallet = await prisma.wallet.findFirst({
            where: { userId: user.id, currency: 'USD' }
          });

          if (wallet) {
            await prisma.$transaction([
               prisma.wallet.update({
                  where: { id: wallet.id },
                  data: { balance: { increment: amount } }
               }),
               prisma.transaction.create({
                  data: {
                     userId: user.id,
                     walletId: wallet.id,
                     type: 'DEPOSIT',
                     amount: amount,
                     currency: 'USD',
                     status: 'COMPLETED',
                     reference: `BITNOB_${payload.data.id}`
                  }
               })
            ]);
            console.log(`[SETTLED]: Credited $${amount} to User ${user.id} via Bitnob Lightning.`);
          }
        }
    }

    res.status(200).send('Webhook Processed');
  } catch (error) {
    console.error('Bitnob Webhook Error:', error);
    res.status(500).send('Webhook Error');
  }
});
// ==========================================
// Payment Links
// ==========================================

app.post('/api/payment-links', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
     const { title, description, amount, currency } = req.body;
     const userId = req.user.userId;
     const slug = Math.random().toString(36).substring(2, 10);

     const link = await prisma.paymentLink.create({
        data: {
           userId,
           title,
           description,
           amount,
           currency: currency || 'USD',
           slug
        }
     });

     res.status(201).json(link);
  } catch (error) {
     res.status(500).json({ error: 'Failed to create payment link' });
  }
});

app.get('/api/pub/payment-links/:slug', async (req: Request, res: Response): Promise<any> => {
   try {
      const slug = req.params.slug as string;
      const link = await prisma.paymentLink.findUnique({
         where: { slug },
         include: { user: { select: { businessName: true, firstName: true } } }
      });

      if (!link || !link.isActive) return res.status(404).json({ error: 'Link not found' });
      res.status(200).json(link);
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch link context' });
   }
});

import axios from 'axios';

// ==========================================
// Email Notification Helper
// ==========================================
const sendEmail = async (to: string, subject: string, html: string) => {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[EMAIL] SMTP not configured. Skipping email to:', to);
    return;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    await transporter.sendMail({ from: `"Paypee" <${SMTP_USER}>`, to, subject, html });
    console.log(`[EMAIL] Sent: "${subject}" → ${to}`);
  } catch (e: any) {
    console.error('[EMAIL] Failed:', e.message);
  }
};

// ==========================================
// Notification Helper
// ==========================================
const createNotification = async (userId: string, title: string, message: string, type: string = 'INFO') => {
  try {
    await prisma.notification.create({ data: { userId, title, message, type } });
  } catch (e: any) {
    console.error('[NOTIFICATION] Failed to create:', e.message);
  }
};

// ==========================================
// KYC/KYB - Prembly (Identitypass) Integration (LIVE)
// ==========================================

// Get KYC Status + Notifications
app.get('/api/verify/status', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { kycStatus: true, email: true, firstName: true }
    });
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ kycStatus: user?.kycStatus, notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// Mark notifications as read
app.post('/api/notifications/read', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, read: false },
      data: { read: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// Submit KYC Verification (LIVE — No demo mode)
app.post('/api/verify/identity', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { idType, idNumber, faceImage } = req.body;
    const userId = req.user.userId;

    console.log(`[KYC DEBUG] 🏁 Starting verification for user: ${userId}`);
    console.log(`[KYC DEBUG] ID Type: ${idType}, ID Number: ${idNumber}`);
    console.log(`[KYC DEBUG] Image received? ${!!faceImage} (Size: ${faceImage?.length || 0} chars)`);

    const PREMBLY_SECRET_KEY = process.env.PREMBLY_SECRET_KEY;

    if (!PREMBLY_SECRET_KEY) {
      console.error('[KYC DEBUG] ❌ PREMBLY_SECRET_KEY is MISSING from environment variables!');
      return res.status(503).json({ 
        error: 'Verification service is temporarily unavailable. Please try again later or contact support.' 
      });
    }

    if (!idType || !idNumber) {
      return res.status(400).json({ error: 'ID Type and ID Number are required.' });
    }

    // Fetch user
    console.log('[KYC DEBUG] 🔍 Checking user in database...');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.kycStatus === 'VERIFIED') {
      return res.status(400).json({ error: 'Your account is already verified.' });
    }

    // Set status to PROCESSING immediately
    console.log('[KYC DEBUG] 💾 Updating user status to PROCESSING...');
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'PROCESSING' }
    });

    await createNotification(userId, '🔄 Verification In Progress', 
      `We have received your ${idType} submission and are performing a biometric face match. This usually takes 30-60 seconds.`,
      'INFO'
    );

    // Call Prembly
    let endpoint = '';
    let payload: Record<string, string> = {};

    if (faceImage && (idType === 'NIN' || idType === 'BVN')) {
       endpoint = 'https://api.prembly.com/identitypass/verification/face-match';
       payload = {
         image: faceImage.replace(/^data:image\/\w+;base64,/, ''),
         number: idNumber,
         id_type: idType
       };
    } else if (idType === 'NIN') {
      endpoint = 'https://api.prembly.com/identitypass/verification/nin';
      payload = { number_nin: idNumber, number: idNumber }; 
    } else if (idType === 'BVN') {
      endpoint = 'https://api.prembly.com/identitypass/verification/bvn';
      payload = { number_bvn: idNumber, number: idNumber, bvn: idNumber }; 
    } else if (idType === 'CAC') {
      endpoint = 'https://api.prembly.com/identitypass/verification/cac';
      payload = { rc_number: idNumber, company_type: 'rc' };
    }

    console.log(`[KYC DEBUG] 📞 Calling Prembly Endpoint: ${endpoint}...`);

    let premblySuccess = false;
    let failureReason = 'Biometric match failed. Please ensure your face is well-lit and matches your ID photo.';

    try {
      const startTime = Date.now();
      const response = await axios.post(endpoint, payload, {
        headers: {
          'x-api-key': PREMBLY_SECRET_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 60000 
      });

      console.log(`[KYC DEBUG] ✅ Prembly responded in ${Date.now() - startTime}ms`);
      console.log(`[KYC DEBUG] Data:`, JSON.stringify(response.data).substring(0, 100));

      const data = response.data;
      premblySuccess = data.status === 'success' || data.response_code === '00' || data.data?.status === 'MATCH';
      
      if (!premblySuccess) {
        failureReason = data.message || data.data?.message || failureReason;
      }
    } catch (premblyError: any) {
      console.error('[KYC DEBUG] ❌ Prembly call failed after attempt!');
      console.error('Error Details:', premblyError.response?.data || premblyError.message);
      
      await prisma.user.update({ where: { id: userId }, data: { kycStatus: 'PENDING' } });
      return res.status(503).json({ error: 'Verification service timeout. Please try again with a better photo.' });
    }

    if (premblySuccess) {
      console.log('[KYC DEBUG] 🎉 Verification SUCCESS! Updating database...');
      await prisma.user.update({ where: { id: userId }, data: { kycStatus: 'VERIFIED' } });

      await createNotification(userId, '✅ Verification Approved!', 
        'Your identity has been successfully verified via biometric match.',
        'SUCCESS'
      );

      return res.status(200).json({ status: 'VERIFIED', message: 'Verification successful!' });
    } else {
      console.log(`[KYC DEBUG] ⚠️ Verification REJECTED. Reason: ${failureReason}`);
      await prisma.user.update({ where: { id: userId }, data: { kycStatus: 'REJECTED' } });

      return res.status(400).json({ 
        status: 'REJECTED', 
        error: failureReason
      });
    }

  } catch (error: any) {
    console.error('[KYC DEBUG] 💥 CRITICAL ERROR:', error.message);
    res.status(500).json({ error: 'An unexpected system error occurred.' });
  }
});

// ==========================================
// AI Treasury & Autonomous Banking
// ==========================================

app.post('/api/ai/hedge', authenticateToken, async (req: any, res: any) => {
  try {
    const result = await AiIntelligenceService.performAutonomousHedging(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'AI Hedging engine failed' });
  }
});

app.get('/api/ai/insights', authenticateToken, async (req: any, res: any) => {
  try {
    const insights = await AiIntelligenceService.getFinancialInsights(req.user.userId);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
});

// ==========================================
// Global Accounts (Virtual IBANs)
// ==========================================

app.post('/api/accounts/provision', authenticateToken, async (req: any, res: any) => {
  try {
    const { currency, bvn, kycData } = req.body;
    if (!['USD', 'EUR', 'GBP', 'NGN', 'BTC', 'USDT', 'USDC'].includes(currency)) {
      return res.status(400).json({ error: 'Unsupported currency for account generation.' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    // ── KYC GATE: Only VERIFIED users may provision new accounts ──
    if (!user || user.kycStatus !== 'VERIFIED') {
      return res.status(403).json({ 
        error: 'Identity verification required. Please complete KYC/KYB before provisioning a bank account.' 
      });
    }

    const name = user?.businessName || `${user?.firstName} ${user?.lastName}`;
    const account = await IbanService.provisionGlobalAccount(req.user.userId, currency, name, bvn, kycData);
    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to provision global IBAN' });
  }
});

app.delete('/api/accounts/:id', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
      const { id } = req.params;
      const wallet = await prisma.wallet.findUnique({ where: { id } });
      
      if (!wallet || wallet.userId !== req.user.userId) {
         return res.status(404).json({ error: 'Account not found or access denied.' });
      }

      await prisma.wallet.delete({ where: { id } });
      res.status(200).json({ message: 'Account deleted successfully' });
   } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ error: 'Failed to delete account' });
   }
});

// ==========================================
// Bill Payments (Airtime, Data, Utilities)
// ==========================================

app.get('/api/bills/categories', authenticateToken, async (req: any, res: any) => {
  try {
    const categories = await Maplerad.getBillCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/bills/billers', authenticateToken, async (req: any, res: any) => {
  try {
    const { category, country } = req.query;
    const billers = await Maplerad.getBillers(category as string, country as string);
    res.json(billers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch billers' });
  }
});

app.get('/api/bills/products', authenticateToken, async (req: any, res: any) => {
  try {
    const { billerId } = req.query;
    const products = await Maplerad.getBillerProducts(billerId as string);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/bills/pay', authenticateToken, async (req: any, res: any) => {
  try {
    const { amount, sourceWalletId, billerId, productId, customerId, phoneNumber, meterNumber } = req.body;
    
    // 1. Verify wallet balance
    const wallet = await prisma.wallet.findUnique({ where: { id: sourceWalletId } });
    if (!wallet || parseFloat(wallet.balance.toString()) < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance.' });
    }

    // 2. Process via Maplerad
    const mapleradCustomer = await Maplerad.createCustomer(req.user.firstName || 'Paypee', req.user.lastName || 'User', req.user.email);
    
    const result = await Maplerad.payBill({
      biller_id: billerId,
      product_id: productId,
      amount: amount,
      customer_id: mapleradCustomer.id,
      phone_number: phoneNumber,
      meter_number: meterNumber
    });

    // 3. Deduct from wallet and record transaction
    const ref = `BILL_${Date.now()}`;
    await prisma.$transaction([
      prisma.wallet.update({ where: { id: sourceWalletId }, data: { balance: { decrement: amount } } }),
      prisma.transaction.create({
        data: {
          userId: req.user.userId,
          walletId: sourceWalletId,
          type: 'WITHDRAWAL',
          amount: amount,
          currency: wallet.currency,
          status: 'COMPLETED',
          reference: ref,
          category: 'BILL_PAYMENT',
          metadata: { billerId, productId, result }
        }
      })
    ]);

    res.status(201).json({ status: 'COMPLETED', reference: ref });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// Virtual Cards (Issuing)
// ==========================================

app.post('/api/cards/issue', authenticateToken, async (req: any, res: any) => {
  try {
    const { currency, amount, walletId } = req.body;
    const userId = req.user.userId;

    // 1. Check wallet balance for initial funding
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || parseFloat(wallet.balance.toString()) < amount) {
      return res.status(400).json({ error: 'Insufficient funds for initial card funding.' });
    }

    // 2. Maplerad customer
    const mapleradCustomer = await Maplerad.createCustomer(req.user.firstName, req.user.lastName, req.user.email);
    
    // 3. Issue via Maplerad
    const card = await Maplerad.issueVirtualCard(mapleradCustomer.id, currency, amount);

    // 4. Update DB
    await prisma.$transaction([
      prisma.wallet.update({ where: { id: walletId }, data: { balance: { decrement: amount } } }),
      prisma.virtualCard.create({
        data: {
          userId,
          walletId,
          cardNumber: card.card_number,
          expiry: card.expiry,
          cvv: card.cvv,
          status: 'ACTIVE',
          dailyLimit: 1000
        }
      }),
      prisma.transaction.create({
        data: {
          userId,
          walletId,
          type: 'WITHDRAWAL',
          amount,
          currency: wallet.currency,
          status: 'COMPLETED',
          reference: `CARD_GEN_${Date.now()}`,
          category: 'CARD_ISSUING'
        }
      })
    ]);

    res.status(201).json(card);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cards', authenticateToken, async (req: any, res: any) => {
  try {
    const cards = await prisma.virtualCard.findMany({ where: { userId: req.user.userId } });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// ==========================================
// Payment Links & Collections (Commerce)
// ==========================================

app.post('/api/collections/links', authenticateToken, async (req: any, res: any) => {
  try {
    const { title, amount, currency, description } = req.body;
    const link = await Maplerad.createPaymentLink({ title, amount, currency, description });
    
    const dbLink = await prisma.paymentLink.create({
      data: {
        userId: req.user.userId,
        title,
        amount,
        currency,
        description,
        slug: link.id,
        isActive: true
      }
    });

    res.status(201).json({ ...dbLink, url: link.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/collections/links', authenticateToken, async (req: any, res: any) => {
  try {
    const links = await prisma.paymentLink.findMany({ where: { userId: req.user.userId } });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// ==========================================
// FX Swap (Maplerad Foreign Exchange) — PRODUCTION
// ==========================================

// In-memory quote store (quotes expire after 30s on Maplerad)
const pendingQuotes = new Map<string, {
  userId: string;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  targetAmount: number;
  rate: number;
  reference: string;
  expiresAt: number;
}>();

// Cleanup expired quotes every 60s
setInterval(() => {
  const now = Date.now();
  for (const [ref, quote] of pendingQuotes) {
    if (now > quote.expiresAt) pendingQuotes.delete(ref);
  }
}, 60000);

/**
 * GET /api/fx/rates — Fetch live exchange rate for display
 */
app.get('/api/fx/rates', authenticateToken, async (req: any, res: any) => {
  try {
    const { source, target } = req.query;
    if (!source || !target) {
      return res.status(400).json({ error: 'source and target query params are required.' });
    }
    const rate = await Maplerad.getExchangeRate(source as string, target as string);
    res.json(rate);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch exchange rate' });
  }
});

/**
 * GET /api/fx/pairs — Supported FX pairs
 */
app.get('/api/fx/pairs', authenticateToken, async (req: any, res: any) => {
  res.json({ pairs: Maplerad.SUPPORTED_FX_PAIRS });
});

/**
 * POST /api/fx/quote — Generate a binding FX quote with balance validation
 */
app.post('/api/fx/quote', authenticateToken, async (req: any, res: any) => {
  try {
    const { sourceCurrency, targetCurrency, amount } = req.body;
    const userId = req.user.userId;
    const parsedAmount = parseFloat(amount);

    // Input validation
    if (!sourceCurrency || !targetCurrency || !amount) {
      return res.status(400).json({ error: 'sourceCurrency, targetCurrency, and amount are required.' });
    }
    if (sourceCurrency === targetCurrency) {
      return res.status(400).json({ error: 'Source and target currencies must be different.' });
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }
    if (parsedAmount < 1) {
      return res.status(400).json({ error: 'Minimum swap amount is 1.00.' });
    }

    // Verify user is KYC-verified
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.kycStatus !== 'VERIFIED') {
      return res.status(403).json({ error: 'Identity verification required before executing FX swaps.' });
    }

    // Check source wallet exists and has sufficient balance
    const sourceWallet = await prisma.wallet.findFirst({
      where: { userId, currency: sourceCurrency as any }
    });
    if (!sourceWallet) {
      return res.status(400).json({ error: `You don't have a ${sourceCurrency} wallet. Please create one first.` });
    }
    if (parseFloat(sourceWallet.balance.toString()) < parsedAmount) {
      return res.status(400).json({ 
        error: `Insufficient ${sourceCurrency} balance. Available: ${parseFloat(sourceWallet.balance.toString()).toFixed(2)}` 
      });
    }

    // Check target wallet exists (create if needed later during swap)
    const targetWallet = await prisma.wallet.findFirst({
      where: { userId, currency: targetCurrency as any }
    });

    console.log(`[FX] Quote request: ${parsedAmount} ${sourceCurrency} → ${targetCurrency} by user ${userId}`);

    // Call Maplerad for binding quote
    const quote = await Maplerad.generateFxQuote(sourceCurrency, targetCurrency, parsedAmount);

    // Cache the quote for swap execution
    const quoteRef = quote.reference || quote.id;
    pendingQuotes.set(quoteRef, {
      userId,
      sourceCurrency,
      targetCurrency,
      sourceAmount: parsedAmount,
      targetAmount: quote.target_amount ? quote.target_amount / 100 : 0,
      rate: quote.rate || 0,
      reference: quoteRef,
      expiresAt: Date.now() + 30000 // 30 second TTL
    });

    res.json({
      reference: quoteRef,
      sourceCurrency,
      targetCurrency,
      sourceAmount: parsedAmount,
      targetAmount: quote.target_amount ? quote.target_amount / 100 : 0,
      rate: quote.rate,
      sourceBalance: parseFloat(sourceWallet.balance.toString()),
      targetWalletExists: !!targetWallet,
      expiresIn: 30 // seconds
    });

  } catch (error: any) {
    console.error('[FX] Quote Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate FX quote' });
  }
});

/**
 * POST /api/fx/swap — Execute a confirmed FX swap
 * This is the critical money-moving endpoint.
 */
app.post('/api/fx/swap', authenticateToken, async (req: any, res: any) => {
  try {
    const { quoteReference, sourceCurrency, targetCurrency, sourceAmount } = req.body;
    const userId = req.user.userId;

    if (!quoteReference) {
      return res.status(400).json({ error: 'quoteReference is required.' });
    }

    // 1. Retrieve cached quote to validate context
    const cachedQuote = pendingQuotes.get(quoteReference);
    if (!cachedQuote) {
      return res.status(410).json({ error: 'Quote has expired. Please generate a new quote.' });
    }
    if (cachedQuote.userId !== userId) {
      return res.status(403).json({ error: 'This quote does not belong to you.' });
    }
    if (Date.now() > cachedQuote.expiresAt) {
      pendingQuotes.delete(quoteReference);
      return res.status(410).json({ error: 'Quote has expired. Please generate a new quote.' });
    }

    // Use cached values (server-authoritative, not client-supplied)
    const src = cachedQuote.sourceCurrency;
    const tgt = cachedQuote.targetCurrency;
    const srcAmount = cachedQuote.sourceAmount;
    const tgtAmount = cachedQuote.targetAmount;
    const rate = cachedQuote.rate;

    // 2. Re-validate source wallet balance (could have changed since quote)
    const sourceWallet = await prisma.wallet.findFirst({
      where: { userId, currency: src as any }
    });
    if (!sourceWallet || parseFloat(sourceWallet.balance.toString()) < srcAmount) {
      pendingQuotes.delete(quoteReference);
      return res.status(400).json({ error: `Insufficient ${src} balance for this swap.` });
    }

    // 3. Find or create target wallet
    let targetWallet = await prisma.wallet.findFirst({
      where: { userId, currency: tgt as any }
    });

    if (!targetWallet) {
      console.log(`[FX] Auto-creating ${tgt} wallet for user ${userId}...`);
      targetWallet = await prisma.wallet.create({
        data: {
          userId,
          currency: tgt as any,
          balance: 0.00,
          metadata: { provider: 'FX_SWAP_AUTO', note: 'Auto-created during currency swap' }
        }
      });
    }

    console.log(`[FX] ⚡ Executing swap: ${srcAmount} ${src} → ${tgtAmount} ${tgt} (Rate: ${rate})`);

    // 4. Execute swap on Maplerad
    let mapleradResult: any;
    try {
      mapleradResult = await Maplerad.executeFxSwap(quoteReference);
    } catch (swapErr: any) {
      // Record failed swap
      await prisma.fxSwap.create({
        data: {
          userId,
          sourceWalletId: sourceWallet.id,
          targetWalletId: targetWallet.id,
          sourceCurrency: src,
          targetCurrency: tgt,
          sourceAmount: srcAmount,
          targetAmount: tgtAmount,
          rate: rate,
          quoteReference,
          provider: 'MAPLERAD',
          status: 'FAILED',
          failureReason: swapErr.message
        }
      });
      
      pendingQuotes.delete(quoteReference);
      throw swapErr;
    }

    // 5. Atomic wallet updates + transaction recording
    const debitRef = `FX_DEBIT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const creditRef = `FX_CREDIT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    await prisma.$transaction([
      // Debit source wallet
      prisma.wallet.update({
        where: { id: sourceWallet.id },
        data: { balance: { decrement: srcAmount } }
      }),
      // Credit target wallet
      prisma.wallet.update({
        where: { id: targetWallet.id },
        data: { balance: { increment: tgtAmount } }
      }),
      // Record debit transaction
      prisma.transaction.create({
        data: {
          userId,
          walletId: sourceWallet.id,
          type: 'WITHDRAWAL',
          amount: srcAmount,
          currency: src as any,
          status: 'COMPLETED',
          reference: debitRef,
          category: 'FX_SWAP',
          metadata: {
            type: 'FX_SWAP_DEBIT',
            targetCurrency: tgt,
            rate: rate,
            quoteReference
          }
        }
      }),
      // Record credit transaction
      prisma.transaction.create({
        data: {
          userId,
          walletId: targetWallet.id,
          type: 'DEPOSIT',
          amount: tgtAmount,
          currency: tgt as any,
          status: 'COMPLETED',
          reference: creditRef,
          category: 'FX_SWAP',
          metadata: {
            type: 'FX_SWAP_CREDIT',
            sourceCurrency: src,
            rate: rate,
            quoteReference
          }
        }
      }),
      // Record FxSwap
      prisma.fxSwap.create({
        data: {
          userId,
          sourceWalletId: sourceWallet.id,
          targetWalletId: targetWallet.id,
          sourceCurrency: src,
          targetCurrency: tgt,
          sourceAmount: srcAmount,
          targetAmount: tgtAmount,
          rate: rate,
          quoteReference,
          providerReference: mapleradResult?.id || mapleradResult?.reference || null,
          provider: 'MAPLERAD',
          status: 'COMPLETED'
        }
      })
    ]);

    // 6. Send notification
    await createNotification(
      userId,
      '💱 Currency Swap Completed',
      `Swapped ${srcAmount.toFixed(2)} ${src} → ${tgtAmount.toFixed(2)} ${tgt} at rate ${rate}`,
      'SUCCESS'
    );

    // 7. Send email notification
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await sendEmail(
        user.email,
        '💱 Paypee — Currency Swap Confirmation',
        `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:2rem;">
          <h2 style="color:#6366f1;">Currency Swap Executed</h2>
          <div style="background:#f8fafc;border-radius:12px;padding:1.5rem;margin:1rem 0;">
            <p><strong>From:</strong> ${srcAmount.toFixed(2)} ${src}</p>
            <p><strong>To:</strong> ${tgtAmount.toFixed(2)} ${tgt}</p>
            <p><strong>Rate:</strong> 1 ${src} = ${rate} ${tgt}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color:#64748b;font-size:0.85rem;">If you did not authorize this swap, contact support immediately.</p>
        </div>`
      );
    }

    // 8. Cleanup
    pendingQuotes.delete(quoteReference);

    console.log(`[FX] ✅ Swap completed: ${srcAmount} ${src} → ${tgtAmount} ${tgt}`);

    res.json({
      status: 'COMPLETED',
      sourceCurrency: src,
      targetCurrency: tgt,
      sourceAmount: srcAmount,
      targetAmount: tgtAmount,
      rate,
      quoteReference,
      providerReference: mapleradResult?.id || mapleradResult?.reference || null
    });

  } catch (error: any) {
    console.error('[FX] Swap Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to execute FX swap' });
  }
});

/**
 * GET /api/fx/history — User's FX swap history
 */
app.get('/api/fx/history', authenticateToken, async (req: any, res: any) => {
  try {
    const swaps = await prisma.fxSwap.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(swaps);
  } catch (error: any) {
    console.error('[FX] History Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to get FX history' });
  }
});

// ==========================================
// Webhook Handlers (Fincra & Maplerad)
// ==========================================

app.post('/api/webhooks/fincra', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['fincra-signature'] as string;
    if (!verifyFincraSignature(signature, req.body)) {
      console.warn('[WEBHOOK] Invalid Fincra signature');
      return res.status(401).send('Unauthorized');
    }

    const { event, data } = req.body;
    console.log(`[WEBHOOK] Fincra Event: ${event}`);

    if (event === 'virtual_account.payment') {
      const { amount, currency, virtual_account_id, reference } = data;
      
      // Find wallet by virtual_account_id in metadata
      const wallets = await prisma.wallet.findMany();
      const wallet = wallets.find(w => {
         const meta = w.metadata as any;
         return meta && (meta.extRef === virtual_account_id || meta.iban === data.account_number);
      });

      if (wallet) {
        await prisma.$transaction([
          prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: amount } }
          }),
          prisma.transaction.create({
            data: {
              userId: wallet.userId,
              walletId: wallet.id,
              type: 'DEPOSIT',
              amount: amount,
              currency: currency,
              status: 'COMPLETED',
              reference: `FINCRA_${reference}`,
              category: 'BANK_TRANSFER',
              metadata: data
            }
          }),
          prisma.notification.create({
            data: {
              userId: wallet.userId,
              title: 'Payment Received',
              message: `Your account has been credited with ${amount} ${currency}.`,
              type: 'SUCCESS'
            }
          })
        ]);
        console.log(`[WEBHOOK] Successfully processed payment of ${amount} ${currency} for user ${wallet.userId}`);
      }
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[WEBHOOK ERROR] Fincra:', error.message);
    res.status(500).send('Error');
  }
});

app.post('/api/webhooks/maplerad', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['maplerad-signature'] as string;
    if (!Maplerad.verifyWebhookSignature(signature, req.body)) {
      console.warn('[WEBHOOK] Invalid Maplerad signature');
      return res.status(401).send('Unauthorized');
    }

    const { event, data } = req.body;
    console.log(`[WEBHOOK] Maplerad Event: ${event}`);

    if (event === 'collection.success') {
      const { amount, currency, account_number, reference } = data;
      const parsedAmount = amount / 100; // Maplerad uses minor units

      // Find wallet by account_number in metadata
      const wallets = await prisma.wallet.findMany();
      const wallet = wallets.find(w => {
         const meta = w.metadata as any;
         return meta && (meta.iban === account_number || meta.account_number === account_number);
      });

      if (wallet) {
        await prisma.$transaction([
          prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: parsedAmount } }
          }),
          prisma.transaction.create({
            data: {
              userId: wallet.userId,
              walletId: wallet.id,
              type: 'DEPOSIT',
              amount: parsedAmount,
              currency: currency,
              status: 'COMPLETED',
              reference: `MAPLERAD_${reference}`,
              category: 'BANK_TRANSFER',
              metadata: data
            }
          }),
          prisma.notification.create({
            data: {
              userId: wallet.userId,
              title: 'Payment Received',
              message: `Your account has been credited with ${parsedAmount} ${currency}.`,
              type: 'SUCCESS'
            }
          })
        ]);
        console.log(`[WEBHOOK] Successfully processed payment of ${parsedAmount} ${currency} for user ${wallet.userId}`);
      }
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[WEBHOOK ERROR] Maplerad:', error.message);
    res.status(500).send('Error');
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Paypee Core API running on http://localhost:${PORT}`);
});
