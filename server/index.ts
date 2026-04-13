import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, AccountRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { issueVirtualCard, processFiatPayout } from './services/fincra';
import { processCryptoPayout, createLightningInvoice } from './services/bitnob';
import { AiIntelligenceService } from './services/ai.service';
import { IbanService } from './services/iban.service';
import { BillsService } from './services/bills.service';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'paypee_super_secret_dev_key';

app.use(cors());
app.use(express.json());

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

    // Auto-provision a default USD Wallet upon registration
    await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: 'USD',
        balance: 0.00
      }
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
    const wallets = await prisma.wallet.findMany({ where: { userId: user.id } });

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
         await prisma.$transaction([
            // Credit the wallet
            prisma.wallet.updateMany({
               where: { userId: user.id, currency: 'USD' }, // Logic for USD settlement
               data: { balance: { increment: amount } }
            }),
            // Log the deposit transaction
            prisma.transaction.create({
               data: {
                  userId: user.id,
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
      const { slug } = req.params;
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
// Automated Verification (KYC/KYB) - Prembly (Identitypass) Integration
// ==========================================

app.post('/api/verify/identity', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { idType, idNumber } = req.body;
    const userId = req.user.userId;
    const PREMBLY_SECRET_KEY = process.env.PREMBLY_SECRET_KEY;
    const PREMBLY_APP_ID = process.env.PREMBLY_APP_ID;

    if (!PREMBLY_SECRET_KEY) {
      // If no key is provided, we stay in 'DEMO' success mode for your testing
      console.warn('PREMBLY_SECRET_KEY missing. Running in DEMO MODE.');
      
      await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: 'VERIFIED' }
      });

      return res.status(200).json({ 
        message: 'DEMO: Verification successful! (Add PREMBLY_SECRET_KEY for real checks)',
        status: 'VERIFIED'
      });
    }

    console.log(`📡 Calling Prembly for User ${userId} (${idType})...`);

    // Determine endpoint based on ID Type (NIN, BVN, or CAC for Business)
    let endpoint = '';
    let payload = {};

    if (idType === 'NIN') {
      endpoint = 'https://api.prembly.com/identitypass/verification/nin';
      payload = { number: idNumber };
    } else if (idType === 'BVN') {
      endpoint = 'https://api.prembly.com/identitypass/verification/bvn';
      payload = { number: idNumber };
    } else if (idType === 'CAC') {
      endpoint = 'https://api.prembly.com/identitypass/verification/cac';
      payload = { rc_number: idNumber };
    } else {
      return res.status(400).json({ error: 'Unsupported ID Type' });
    }

    const response = await axios.post(endpoint, payload, {
      headers: {
        'x-api-key': PREMBLY_SECRET_KEY,
        'app-id': PREMBLY_APP_ID,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'success' || response.data.response_code === '00') {
      await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: 'VERIFIED' }
      });

      return res.status(200).json({ 
        message: 'Verification successful!',
        status: 'VERIFIED',
        details: response.data.data
      });
    } else {
      return res.status(400).json({ error: 'Verification failed: ' + (response.data.message || 'Invalid details') });
    }

  } catch (error: any) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Identity verification service error.' });
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
    const { currency } = req.body;
    if (!['EUR', 'GBP', 'CNY'].includes(currency)) {
      return res.status(400).json({ error: 'Unsupported currency for global IBAN.' });
    }
    const account = await IbanService.provisionGlobalAccount(req.user.userId, currency);
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to provision global IBAN' });
  }
});

// ==========================================
// Bill Payments (Airtime, Data, Utilities)
// ==========================================

app.get('/api/bills/providers', authenticateToken, async (req: any, res: any) => {
  try {
    const providers = await BillsService.getProviders(req.query.category as string || 'AIRTIME');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch billers' });
  }
});

app.post('/api/bills/pay', authenticateToken, async (req: any, res: any) => {
  try {
    const transaction = await BillsService.payBill(req.user.userId, req.body);
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Paypee Core API running on http://localhost:${PORT}`);
});
