import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { PrismaClient, AccountRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import { AiIntelligenceService } from './services/ai.service';
import { IbanService } from './services/iban.service';
import { BillsService } from './services/bills.service';
import { NotificationService } from './services/notification.service';
import * as Maplerad from './services/maplerad';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'paypee_super_secret_dev_key';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

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

app.get('/api/users/me', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { passwordHash, transferPin, ...safeUser } = user;
    const wallets = await prisma.wallet.findMany({ where: { userId: user.id } });
    
    // AUTO-SYNC: Trigger reconciliation (background)
    IbanService.reconcileUserWallets(user.id).catch(err => console.error('[BG-RECONCILE] Error:', err));

    res.json({ ...safeUser, wallets, isPinSet: !!transferPin });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/set-pin', authenticateToken, async (req: any, res: any) => {
  try {
    const { pin, password } = req.body;
    if (!pin || pin.length !== 4) return res.status(400).json({ error: 'PIN must be 4 digits' });
    
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const hashedPin = await bcrypt.hash(pin, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { transferPin: hashedPin }
    });

    res.json({ message: 'Transaction PIN set successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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

app.post('/api/cards/:cardId/fund', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
      const { cardId } = req.params;
      const { amount, walletId, pin } = req.body;
      const userId = req.user.userId;

      // Check balance
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { wallets: true } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.transferPin) {
        if (!pin) return res.status(400).json({ error: 'Transaction PIN is required' });
        const validPin = await bcrypt.compare(pin, user.transferPin);
        if (!validPin) return res.status(401).json({ error: 'Invalid Transaction PIN' });
      }

      // 1. Validate Card & Wallet
      const card = await prisma.virtualCard.findUnique({ where: { id: cardId } });
      if (!card || card.userId !== userId) return res.status(404).json({ error: 'Card not found' });

      const wallet = user.wallets.find(w => w.id === walletId);
      if (!wallet || Number(wallet.balance) < amount) {
         return res.status(400).json({ error: 'Insufficient funds or invalid wallet' });
      }

      // 2. Atomic Update
      await prisma.$transaction([
         prisma.wallet.update({
            where: { id: walletId },
            data: { balance: { decrement: amount } }
         }),
         prisma.transaction.create({
            data: {
               userId,
               walletId,
               type: 'CARD_PAYMENT',
               amount,
               currency: wallet.currency,
               status: 'COMPLETED',
               reference: `CARD_FUND_${Date.now()}`,
               category: 'CARD',
               desc: `Funded Card ending in ${card.cardNumber.slice(-4)}`
            }
         })
      ]);

      res.status(200).json({ message: 'Card funded successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Failed to fund card' });
   }
});

app.post('/api/cards/:cardId/withdraw', authenticateToken, async (req: any, res: any): Promise<any> => {
   try {
      const { cardId } = req.params;
      const { amount, pin } = req.body;
      const userId = req.user.userId;

      if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid withdrawal amount' });

      // Validate user & PIN
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { wallets: true } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.transferPin) {
        if (!pin) return res.status(400).json({ error: 'Transaction PIN is required' });
        const validPin = await bcrypt.compare(pin, user.transferPin);
        if (!validPin) return res.status(401).json({ error: 'Invalid Transaction PIN' });
      }

      // Validate Card
      const card = await prisma.virtualCard.findUnique({ where: { id: cardId } });
      if (!card || card.userId !== userId) return res.status(404).json({ error: 'Card not found' });

      // Find the linked wallet
      const wallet = user.wallets.find(w => w.id === card.walletId);
      if (!wallet) return res.status(404).json({ error: 'Linked wallet not found' });

      // Check card has enough balance — use dailyLimit as the DB-tracked balance
      const cardBalance = Number(card.dailyLimit);
      if (cardBalance < amount) {
        return res.status(400).json({ error: `Insufficient card balance. Available: $${cardBalance.toFixed(2)}` });
      }

      // Attempt provider-side withdrawal if card has a provider ID
      if (card.providerCardId) {
        try {
          await Maplerad.withdrawFromCard(card.providerCardId, amount);
          console.log(`[CARDS] Maplerad withdraw success for ${card.providerCardId}: $${amount}`);
        } catch (providerErr: any) {
          console.error(`[CARDS] Provider withdraw failed:`, providerErr.message);
          // Continue with local balance update even if provider call fails (sandbox limitation)
        }
      }

      // Atomic: Credit wallet + Debit card balance + Record transaction
      await prisma.$transaction([
         prisma.wallet.update({
            where: { id: card.walletId },
            data: { balance: { increment: amount } }
         }),
         prisma.virtualCard.update({
            where: { id: cardId },
            data: { dailyLimit: { decrement: amount } }
         }),
         prisma.transaction.create({
            data: {
               userId,
               walletId: card.walletId,
               type: 'DEPOSIT',
               amount,
               currency: wallet.currency,
               status: 'COMPLETED',
               reference: `CARD_WITHDRAW_${Date.now()}`,
               category: 'CARD',
               desc: `Withdrawal from Card ending in ${card.cardNumber.slice(-4)}`
            }
         })
      ]);

      console.log(`[CARDS] Withdrawal complete: $${amount} from card ${cardId} -> wallet ${card.walletId}`);

      // Send notification
      await NotificationService.create(
        userId,
        '💳 Card Withdrawal',
        `$${amount.toFixed(2)} withdrawn from your card ending in ${card.cardNumber.slice(-4)} to your ${wallet.currency} wallet.`,
        'SUCCESS'
      );

      res.status(200).json({ message: 'Withdrawal successful' });
   } catch (error: any) {
      console.error('[CARDS] Withdraw Error:', error.message);
      res.status(500).json({ error: 'Failed to withdraw from card' });
   }
});

app.get('/api/cards/:cardId/subscriptions', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { cardId } = req.params;
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: req.user.userId,
        desc: { contains: 'CARD', mode: 'insensitive' } // Simplified lookup
      },
      orderBy: { createdAt: 'desc' }
    });

    const blocked = await prisma.blockedMerchant.findMany({ where: { cardId } });
    const blockedNames = blocked.map(b => b.name.toLowerCase());

    const platformKeywords = ['Netflix', 'Spotify', 'Amazon', 'Apple', 'Google', 'Youtube', 'LinkedIn', 'ChatGPT', 'Microsoft', 'Adobe', 'Figma', 'Heroku', 'DigitalOcean', 'Cloudflare'];
    const detected = new Map();

    // Simulated detection from description strings
    transactions.forEach(tx => {
      const desc = tx.desc || '';
      platformKeywords.forEach(keyword => {
        if (desc.toLowerCase().includes(keyword.toLowerCase())) {
          const name = keyword;
          if (!detected.has(name)) {
            detected.set(name, { 
              name, 
              lastCharge: tx.createdAt, 
              amount: tx.amount, 
              status: blockedNames.includes(name.toLowerCase()) ? 'BLOCKED' : 'ACTIVE',
              nextBilling: new Date(new Date(tx.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000)
            });
          }
        }
      });
    });

    res.json(Array.from(detected.values()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

app.post('/api/cards/:cardId/block-merchant', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { cardId } = req.params;
    const { merchantName } = req.body;

    const existing = await prisma.blockedMerchant.findFirst({
      where: { cardId, name: merchantName }
    });

    if (existing) {
      await prisma.blockedMerchant.delete({ where: { id: existing.id } });
      return res.json({ message: 'Merchant unblocked', status: 'UNBLOCKED' });
    }

    await prisma.blockedMerchant.create({
      data: { cardId, name: merchantName }
    });

    res.json({ message: 'Merchant blocked successfully', status: 'BLOCKED' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle merchant block' });
  }
});

// ==========================================
// Virtual Cards Routes
// ==========================================

app.get('/api/cards', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const userId = req.user.userId;
    console.log(`[CARDS] Fetching cards for user: ${userId}`);
    
    const cards = await prisma.virtualCard.findMany({ 
      where: { userId },
      include: { wallet: true },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`[CARDS] Found ${cards.length} cards in database.`);
    
    // Fetch live details from Maplerad for each card to get the actual balance
    const liveCards = await Promise.all(cards.map(async (c) => {
      try {
        if (!c.providerCardId) return { ...c, balance: c.dailyLimit };

        const mCard = await Maplerad.getCard(c.providerCardId);
        if (!mCard) return { ...c, balance: c.dailyLimit };

        // Calculate live balance (Maplerad returns amount in kobo/cents)
        const liveBalance = (mCard.amount || 0) / 100;

        // If DB is missing address info, update it now (Auto-migration for existing cards)
        if (!c.addressLine1 && mCard.address) {
          await prisma.virtualCard.update({
            where: { id: c.id },
            data: {
              addressLine1: mCard.address.address,
              addressCity: mCard.address.city,
              addressState: mCard.address.state,
              addressCountry: mCard.address.country || 'USA',
              addressZip: mCard.address.postal_code
            }
          });
        }

        return {
          ...c,
          balance: liveBalance,
          addressLine1: c.addressLine1 || mCard.address?.address,
          addressCity: c.addressCity || mCard.address?.city,
          addressState: c.addressState || mCard.address?.state,
          addressCountry: c.addressCountry || mCard.address?.country,
          addressZip: c.addressZip || mCard.address?.postal_code,
          status: mCard.status || c.status
        };
      } catch (e) {
        console.error(`[CARDS] Sync Error for ${c.id}:`, e);
        return { ...c, balance: c.dailyLimit };
      }
    }));

    res.json(liveCards);
  } catch (error) {
    console.error('[CARDS] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch virtual cards' });
  }
});

app.post('/api/cards', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { walletId, currency, initialAmount } = req.body;
    const userId = req.user.userId;
    console.log(`[CARDS] Received issuance request: User=${userId}, Wallet=${walletId}, Rail=${currency}`);
    const cardInitialUSD = initialAmount || 1; // Default $1 for Virtual Cards as per new requirement

    // 1. Validate Wallet & Check Balance (with cross-currency support)
    const wallet = await prisma.wallet.findFirst({ where: { id: walletId, userId } });
    if (!wallet) return res.status(404).json({ error: 'Source wallet not found' });

    let costInWalletCurrency = cardInitialUSD;
    let conversionRate = 1;

    if (wallet.currency !== (currency || 'USD')) {
      // Fetch live rate for conversion (e.g. USD to NGN)
      const rateData = await Maplerad.getExchangeRate(currency || 'USD', wallet.currency);
      conversionRate = rateData.rate;
      costInWalletCurrency = cardInitialUSD * conversionRate;
    }

    if (parseFloat(wallet.balance.toString()) < costInWalletCurrency) {
      return res.status(400).json({ 
        error: `Insufficient ${wallet.currency} balance. Need ${costInWalletCurrency.toFixed(2)} ${wallet.currency} to cover $${cardInitialUSD} initial funding.` 
      });
    }

    // 2. Get or Create Maplerad Customer
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const customer = await Maplerad.createCustomer(user?.firstName || 'User', user?.lastName || 'Paypee', user?.email || '');
    
    // 3. Issue Card via Maplerad
    console.log(`[MAPLERAD] Issuing ${currency || 'USD'} card for customer ${customer.id} with $${cardInitialUSD}...`);
    const mCard = await Maplerad.issueVirtualCard(customer.id, currency || 'USD', cardInitialUSD);
    console.log(`[MAPLERAD] Raw Provider Response:`, JSON.stringify(mCard));

    if (!mCard || (!mCard.card_number && !mCard.card_no)) {
      throw new Error('Provider failed to return valid card details.');
    }

    // Maplerad sometimes returns card_no instead of card_number
    const rawCardNumber = mCard.card_number || mCard.card_no;
    const cardNumber = String(rawCardNumber).replace(/\s/g, ''); // Normalize: remove spaces
    const expiry = mCard.expiry || mCard.expiry_date || (mCard.expiry_month ? `${mCard.expiry_month}/${mCard.expiry_year}` : '12/2029');
    const cvv = mCard.cvv || mCard.cvv2 || '000';
    const providerCardId = mCard.id || mCard.card_id || cardNumber;

    console.log(`[MAPLERAD] Normalized Details: ${cardNumber} | ID: ${providerCardId}`);

    const addressLine1 = mCard.address?.address || mCard.address_line1 || '';
    const addressCity = mCard.address?.city || mCard.city || '';
    const addressState = mCard.address?.state || mCard.state || '';
    const addressCountry = mCard.address?.country || mCard.country || 'USA'; // Default for virtual cards usually
    const addressZip = mCard.address?.postal_code || mCard.zip_code || mCard.postal_code || '';

    // 4. Atomic Balance Deduction & Card Creation
    try {
      const [card] = await prisma.$transaction([
        prisma.virtualCard.create({
          data: {
            userId,
            walletId,
            cardNumber,
            expiry,
            cvv,
            providerCardId,
            status: "ACTIVE",
            dailyLimit: cardInitialUSD,
            addressLine1,
            addressCity,
            addressState,
            addressCountry,
            addressZip
          }
        }),
        prisma.wallet.update({
          where: { id: walletId },
          data: { balance: { decrement: costInWalletCurrency } }
        }),
        prisma.transaction.create({
          data: {
            userId,
            walletId,
            type: 'WITHDRAWAL',
            amount: costInWalletCurrency,
            currency: wallet.currency,
            status: 'COMPLETED',
            reference: `CARD_ISSUE_${Date.now()}`,
            category: 'CARD',
            desc: `Issued ${currency || 'USD'} Virtual Card (Initial: $${cardInitialUSD})`
          }
        })
      ]);
      console.log(`[CARDS] Transaction Committed Successfully. CardID: ${card.id}`);
      res.status(201).json(card);
    } catch (prismaError: any) {
      console.error('[PRISMA ERROR] Card Creation Failed:', prismaError);
      if (prismaError.code === 'P2002') {
        return res.status(400).json({ error: 'This card number already exists in our system. Provider returned a duplicate sandbox card.' });
      }
      throw prismaError;
    }
  } catch (error: any) {
    console.error('Create card error:', error);
    res.status(500).json({ error: error.message || 'Failed to issue virtual card' });
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
       
       if (process.env.MAPLERAD_SECRET_KEY) {
         try {
           // We use Maplerad as the primary gateway for all crypto/fiat payouts
           const destNumber = req.body.destinationAccount || req.body.destinationAddress || '0123456789';
           const destBank = req.body.bankCode || '058';
           await Maplerad.processPayout(amount, currency, { number: destNumber, bankCode: destBank });
         } catch (err) {
           console.warn('Maplerad payout routing warning:', err);
         }
       }
       
       await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } }
      });
    } else if (type === 'DEPOSIT') {
       if (currency === 'USD' || currency === 'BTC') {
         // Maplerad handles crypto address generation via IbanService
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
app.get('/api/payouts/verify', authenticateToken, async (req: any, res: any) => {
  try {
    const { accountNumber, bankCode } = req.query;
    if (!accountNumber || !bankCode) {
      return res.status(400).json({ error: 'Account number and bank code are required' });
    }
    const data = await Maplerad.verifyAccountNumber(accountNumber as string, bankCode as string);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payouts/transfer', authenticateToken, async (req: any, res: any) => {
  try {
    const { amount, sourceCurrency, targetCurrency, bankCode, accountNumber, routingNumber, swiftCode, iban, walletId, accountName } = req.body;
    const userId = req.user.userId;
    const parsedAmount = parseFloat(amount); // This is the amount in sourceCurrency to deduct

    const hasBankOrIntlCode = bankCode || routingNumber || iban || swiftCode;
    if (!walletId || !hasBankOrIntlCode || !accountNumber || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid payout parameters' });
    }

    // Check balance
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { wallets: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { pin } = req.body;
    if (user.transferPin) {
       if (!pin) return res.status(400).json({ error: 'Transaction PIN is required' });
       const validPin = await bcrypt.compare(pin, user.transferPin);
       if (!validPin) return res.status(401).json({ error: 'Invalid Transaction PIN' });
    }

    const wallet = user.wallets.find(w => w.id === walletId);
    if (!wallet) {
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
      payoutAmount = quote.target_amount ? quote.target_amount / 100 : (parsedAmount * (quote.rate || 1));
      fxRate = quote.rate || 1;

      // 2. Execute FX Swap internally on Maplerad
      await Maplerad.executeFxSwap(quoteRef);
      payoutCurrency = targetCurrency;
      
      console.log(`[PAYOUT] FX Swap complete. Executing transfer of ${payoutAmount} ${payoutCurrency}`);
    } else {
      console.log(`[PAYOUT] Executing local transfer of ${parsedAmount} ${payoutCurrency}`);
    }

    // 3. Execute Maplerad Payout (Handles both Fiat and Crypto)
    const isMoMo = ['KES', 'GHS', 'UGX', 'RWF', 'XAF', 'XOF', 'TZS'].includes(payoutCurrency);
    const isCrypto = ['BTC', 'USDT', 'USDC'].includes(payoutCurrency);

    const accountDetails = {
      bankCode,
      number: accountNumber,
      routing_number: routingNumber,
      swift_code: swiftCode,
      iban: iban,
      accountName: accountName,
      beneficiary_type: isMoMo ? 'mobile_money' : (isCrypto ? 'crypto_address' : 'bank_account')
    };

    const reference = `PAYOUT_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 4. DEBIT FIRST — Reserve funds before calling external API
    // This prevents the scenario where Maplerad succeeds but our DB never gets updated
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: parsedAmount } }
      }),
      prisma.transaction.create({
        data: {
          userId,
          walletId,
          type: 'WITHDRAWAL',
          amount: parsedAmount,
          currency: wallet.currency as any,
          status: 'PENDING',
          reference,
          category: isCrypto ? 'CRYPTO' : 'TRANSFER',
          desc: isCrypto ? `Crypto Transfer to ${accountNumber.substring(0, 8)}...` : `Transfer to ${accountName || 'Recipient'} • ${req.body.bankName || 'Local Bank'}`,
          metadata: {
            provider: 'MAPLERAD',
            bankCode,
            accountNumber,
            accountName,
            targetCurrency: payoutCurrency,
            targetAmount: payoutAmount,
            fxRate: fxRate
          }
        }
      })
    ]);

    console.log(`[PAYOUT] Funds reserved. Executing Maplerad transfer...`);

    // 5. Call Maplerad — if this fails, rollback the debit
    let payoutResult: any;
    try {
      payoutResult = await Maplerad.processPayout(payoutAmount, payoutCurrency, accountDetails);
    } catch (payoutErr: any) {
      console.error(`[PAYOUT ROLLBACK] Maplerad failed, reversing debit for ${reference}:`, payoutErr.message);
      
      // Rollback: re-credit the wallet and mark transaction as FAILED
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: parsedAmount } }
        }),
        prisma.transaction.update({
          where: { reference },
          data: { 
            status: 'FAILED',
            metadata: {
              provider: 'MAPLERAD',
              bankCode,
              accountNumber,
              accountName,
              targetCurrency: payoutCurrency,
              targetAmount: payoutAmount,
              fxRate: fxRate,
              failureReason: payoutErr.message
            }
          }
        })
      ]);

      throw payoutErr;
    }

    // 6. Finalize: mark transaction as COMPLETED with provider reference
    await prisma.transaction.update({
      where: { reference },
      data: { 
        status: 'COMPLETED',
        metadata: {
          provider: 'MAPLERAD',
          providerReference: payoutResult?.id || null,
          bankCode,
          accountNumber,
          accountName,
          targetCurrency: payoutCurrency,
          targetAmount: payoutAmount,
          fxRate: fxRate
        }
      }
    });

    console.log(`[PAYOUT SUCCESS] Transfer ${reference} completed for User ${userId}`);

    await NotificationService.create(
      userId,
      '💸 Transfer Successful',
      `Your transfer of ${payoutAmount.toLocaleString()} ${payoutCurrency} to ${accountName || accountNumber} was successful.`,
      'SUCCESS'
    );

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
       await prisma.transaction.update({
         where: { reference },
         data: { status: 'FAILED' }
       });
    }

    // Handle Incoming Payments (Deposits)
    if (payload.event === 'collection.successful' || payload.event === 'charge.completed' || payload.event === 'virtual_account.credited') {
       const { amount, currency, reference, customer } = payload.data;
       const parsedAmount = Number(amount);
       
       // Find user by email or wallet by account reference
       const user = await prisma.user.findFirst({ where: { email: customer.email } });
       if (user) {
         const wallet = await prisma.wallet.findFirst({ where: { userId: user.id, currency } });
         if (wallet) {
           await prisma.$transaction([
             prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: parsedAmount } } }),
             prisma.transaction.create({
               data: {
                 userId: user.id,
                 walletId: wallet.id,
                 type: 'DEPOSIT',
                 amount: parsedAmount,
                 currency,
                 status: 'COMPLETED',
                 reference: `FINCRA_${reference}`,
                 desc: `Inbound Settlement (Fincra)`,
                 category: 'BANK_TRANSFER'
               }
             }),
             prisma.notification.create({
               data: {
                 userId: user.id,
                 title: 'Funds Received',
                 message: `Your ${currency} wallet has been credited with ${parsedAmount} via Fincra.`,
                 type: 'SUCCESS'
               }
             })
           ]);
           console.log(`[FINCRA DEPOSIT] Processed ${parsedAmount} ${currency} for User ${user.id}`);
         }
       }
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

app.get('/api/payment-links', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const links = await prisma.paymentLink.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment links' });
  }
});

// ==========================================
// Vaults (Savings)
// ==========================================

app.get('/api/vaults', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const vaults = await prisma.vault.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(vaults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vaults' });
  }
});

app.post('/api/vaults', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { name, amount, currency, walletId } = req.body;
    
    // Deduct from wallet
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || Number(wallet.balance) < amount) {
      return res.status(400).json({ error: 'Insufficient funds in source wallet' });
    }

    const result = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } }
      }),
      prisma.vault.create({
        data: {
          userId: req.user.userId,
          name,
          balance: amount,
          currency: currency || wallet.currency,
          type: 'SAVINGS'
        }
      }),
      prisma.transaction.create({
        data: {
          userId: req.user.userId,
          walletId,
          type: 'TRANSFER',
          amount,
          currency: wallet.currency,
          status: 'COMPLETED',
          reference: `VAULT_FUND_${Date.now()}`,
          category: 'VAULT',
          desc: `Funded Vault: ${name}`
        }
      })
    ]);

    await NotificationService.create(
      req.user.userId,
      '🏦 Vault Funded',
      `You have successfully moved ${amount} ${currency || wallet.currency} into your ${name} vault.`,
      'SUCCESS'
    );

    res.status(201).json(result[1]);
  } catch (error) {
    console.error('Vault creation error:', error);
    res.status(500).json({ error: 'Failed to create vault' });
  }
});

// Bills & Utilities

app.get('/api/bills/categories', authenticateToken, async (req: any, res: any) => {
  try {
    const categories = await Maplerad.getBillCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/bills/providers', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { category } = req.query;
    const providers = await BillsService.getProviders(category as string);
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bills/products', authenticateToken, async (req: any, res: any) => {
  try {
    const { billerId } = req.query;
    const products = await BillsService.getProducts(billerId as string);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/bills/pay', authenticateToken, async (req: any, res: any): Promise<any> => {
  try {
    const { walletId, amount, providerId, productId, customerId, category } = req.body;
    const transaction = await BillsService.payBill(req.user.userId, {
      walletId,
      amount,
      providerId,
      productId,
      customerId,
      category
    });
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
    const userId = req.user.userId;
    
    // Trigger background reconciliation to catch missed payments/metadata
    // We don't await this so the status response remains fast
    IbanService.reconcileUserWallets(userId).catch(err => console.error('[BG-RECONCILE] Error:', err));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true, email: true, firstName: true }
    });
    const notifications = await prisma.notification.findMany({
      where: { userId },
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

    await NotificationService.create(userId, '🔄 Verification In Progress', 
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

      await NotificationService.create(userId, '✅ Verification Approved!', 
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
    if (!['USD', 'EUR', 'GBP', 'NGN', 'BTC', 'USDT', 'USDC', 'KES', 'GHS', 'UGX', 'RWF', 'XAF', 'XOF', 'TZS'].includes(currency)) {
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

app.post('/api/accounts/reconcile', authenticateToken, async (req: any, res: any) => {
  try {
    const result = await IbanService.reconcileUserWallets(req.user.userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Reconciliation failed' });
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

// Bill Payments (Airtime, Data, Utilities)
app.get('/api/bills/categories', authenticateToken, async (req: any, res: any) => {
   try {
     const categories = await Maplerad.getBillCategories();
     res.json(categories);
   } catch (error: any) {
     res.status(500).json({ error: error.message });
   }
});

app.get('/api/bills/providers', authenticateToken, async (req: any, res: any) => {
  try {
    const category = req.query.category as string;
    const providers = await BillsService.getProviders(category);
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bills/products', authenticateToken, async (req: any, res: any) => {
  try {
    const billerId = req.query.billerId as string;
    const products = await BillsService.getProducts(billerId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bills/pay', authenticateToken, async (req: any, res: any) => {
  try {
    const result = await BillsService.payBill(req.user.userId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
    
    await NotificationService.create(
      userId,
      '💳 Virtual Card Issued',
      `Your new ${currency} virtual card has been issued and funded with ${amount} ${currency}.`,
      'SUCCESS'
    );

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
      targetAmount: quote.target_amount ? quote.target_amount / 100 : (parsedAmount * (quote.rate || 0)),
      rate: quote.rate || 0,
      reference: quoteRef,
      expiresAt: Date.now() + 30000 // 30 second TTL
    });

    res.json({
      reference: quoteRef,
      sourceCurrency,
      targetCurrency,
      sourceAmount: parsedAmount,
      targetAmount: quote.target_amount ? quote.target_amount / 100 : (parsedAmount * (quote.rate || 0)),
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
    const { quoteReference, sourceCurrency, targetCurrency, sourceAmount, pin } = req.body;
    const userId = req.user.userId;

    // Verify PIN
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.transferPin) {
       if (!pin) return res.status(400).json({ error: 'Transaction PIN is required' });
       const validPin = await bcrypt.compare(pin, user.transferPin);
       if (!validPin) return res.status(401).json({ error: 'Invalid Transaction PIN' });
    }

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
          desc: `Swap ${srcAmount} ${src} → ${tgtAmount} ${tgt}`,
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
          desc: `Swap ${srcAmount} ${src} → ${tgtAmount} ${tgt}`,
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
    await NotificationService.create(
      userId,
      '💱 Currency Swap Completed',
      `Swapped ${srcAmount.toFixed(2)} ${src} → ${tgtAmount.toFixed(2)} ${tgt} at rate ${rate}`,
      'SUCCESS'
    );

    // 7. Send email notification
    if (user?.email) {
      await NotificationService.sendEmail(
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

// Unified Maplerad Webhook Handler
app.post('/api/webhooks/maplerad', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['maplerad-signature'] as string;
    const payload = req.body;
    const { event, id, data, status, reference } = payload;

    console.log(`[MAPLERAD WEBHOOK] Received event: ${event}, id: ${id}, status: ${status}`);

    // 1. Verify Signature
    if (!Maplerad.verifyWebhookSignature(signature, payload)) {
      console.warn('[MAPLERAD WEBHOOK] Invalid signature. Ignoring request.');
      return res.status(401).send('Unauthorized');
    }

    // 2. Idempotency check — skip if we already processed this webhook ID
    const webhookRef = `MAPLE_WH_${id || reference || Date.now()}`;
    const existingTx = await prisma.transaction.findFirst({ where: { reference: webhookRef } });
    if (existingTx) {
      console.log(`[MAPLERAD WEBHOOK] Already processed: ${webhookRef}. Skipping.`);
      return res.status(200).send('Already processed');
    }

    // 3. Handle Inbound Payments (Deposits into virtual accounts)
    if (event === 'collection.successful' || event === 'collection.success' || 
        event === 'virtual_account.payment' || event === 'virtual_account.credit') {
      
      // Maplerad webhook can have data at top level or nested
      const txData = data || payload;
      const amount = Number(txData.amount || txData.total_amount || 0);
      const currency = (txData.currency || txData.coin || '').toUpperCase();
      const account_number = String(txData.account_number || txData.virtual_account_number || 
                             txData.virtual_account?.account_number ||
                             txData.meta?.account_number || txData.meta?.virtual_account_number ||
                             txData.address || txData.wallet_address || '').trim();
      
      const customer_id = txData.customer_id || txData.customer?.id || txData.meta?.customer_id;
      
      const isCrypto = ['BTC', 'USDT', 'USDC'].includes(currency);
      let parsedAmount = amount;
      if (!isCrypto) {
          parsedAmount = amount / 100;
      }
      
      console.log(`[MAPLERAD WEBHOOK] Processing ${currency} deposit: ${parsedAmount} (Raw: ${amount}) for account/address: ${account_number}, Customer: ${customer_id}`);

      // Find user/wallet
      const wallets = await prisma.wallet.findMany({ include: { user: true } });
      
      // 1. Try finding by account number/address
      let resolvedWallet = wallets.find(w => {
         const meta = w.metadata as any;
         if (!meta) return false;
         const walletAcc = String(meta.iban || meta.account_number || meta.accountNumber || 
                                 meta.virtual_account_number || meta.nuban || 
                                 meta.address || meta.wallet_address || '').trim();
         return walletAcc === account_number && account_number !== '';
      });

      // 2. Try finding by customer_id + currency
      if (!resolvedWallet && customer_id && currency) {
        resolvedWallet = wallets.find(w => {
           const userMeta = (w.user as any)?.metadata as any;
           return userMeta?.customerId === customer_id && w.currency === currency;
        });
        if (resolvedWallet) console.log(`[MAPLERAD WEBHOOK] Matched by customer_id and currency: ${currency}`);
      }

      // 3. Last resort: Match by currency if user has only one (risky, but useful for debugging)
      if (!resolvedWallet && currency) {
        const currencyWallets = wallets.filter(w => w.currency === currency);
        if (currencyWallets.length === 1) {
          resolvedWallet = currencyWallets[0];
          console.log(`[MAPLERAD WEBHOOK] Matched by unique currency fallback: ${currency}`);
        }
      }

      if (resolvedWallet) {
        await prisma.$transaction([
          prisma.wallet.update({
            where: { id: resolvedWallet.id },
            data: { balance: { increment: parsedAmount } }
          }),
          prisma.transaction.create({
            data: {
              userId: resolvedWallet.userId,
              walletId: resolvedWallet.id,
              type: 'DEPOSIT',
              amount: parsedAmount,
              currency: currency || resolvedWallet.currency,
              status: 'COMPLETED',
              reference: webhookRef,
              desc: txData.sender_name ? `Funds from ${txData.sender_name}` : `Deposit via ${account_number || 'Virtual Account'}`,
              category: 'BANK_TRANSFER',
              metadata: txData
            }
          }),
          prisma.notification.create({
            data: {
              userId: resolvedWallet.userId,
              title: '💰 Funds Received',
              message: `Your ${currency || resolvedWallet.currency} wallet has been credited with ${parsedAmount.toLocaleString()}.`,
              type: 'SUCCESS'
            }
          })
        ]);
        console.log(`[MAPLERAD WEBHOOK] ✅ Credited ${parsedAmount} ${currency} for User ${resolvedWallet.userId}`);
      } else {
        console.warn(`[MAPLERAD WEBHOOK] ⚠️ No wallet found for account: ${account_number}, currency: ${currency}`);
      }
    }

    // 4. Handle Transfer Events (Payout status updates)
    else if (event === 'transfer.successful') {
      console.log(`[MAPLERAD WEBHOOK] Transfer succeeded: ${id}`);
      // Try to find the matching pending transaction by provider reference
      const tx = await prisma.transaction.findFirst({
        where: {
          status: 'PENDING',
          metadata: { path: ['providerReference'], equals: id }
        }
      });
      if (tx) {
        await prisma.transaction.update({
          where: { id: tx.id },
          data: { status: 'COMPLETED' }
        });
      }
    }

    else if (event === 'transfer.failed') {
      console.log(`[MAPLERAD WEBHOOK] Transfer failed: ${id}`);
      const tx = await prisma.transaction.findFirst({
        where: {
          status: 'PENDING',
          metadata: { path: ['providerReference'], equals: id }
        }
      });
      if (tx) {
        // Rollback the debit
        await prisma.$transaction([
          prisma.wallet.update({
            where: { id: tx.walletId },
            data: { balance: { increment: tx.amount } }
          }),
          prisma.transaction.update({
            where: { id: tx.id },
            data: { status: 'FAILED' }
          })
        ]);

        await NotificationService.create(
          tx.userId,
          '❌ Transfer Failed',
          `Your transfer of ${tx.amount} ${tx.currency} has been reversed.`,
          'ERROR'
        );
      }
    }

    else {
      console.log(`[MAPLERAD WEBHOOK] Unhandled event: ${event}`);
    }

    res.status(200).send('Webhook Processed');
  } catch (error: any) {
    console.error('[MAPLERAD WEBHOOK ERROR]:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/admin/fix-swaps', async (req: any, res: any) => {
  try {
    const swaps = await prisma.fxSwap.findMany({
      where: { targetAmount: 0, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' }
    });
    
    let fixedCount = 0;
    const details = [];

    for (const swap of swaps) {
      if (Number(swap.targetAmount) === 0) {
        const correctTargetAmount = Number(swap.sourceAmount) * Number(swap.rate);
        
        // 1. Update FxSwap record
        await prisma.fxSwap.update({
          where: { id: swap.id },
          data: { targetAmount: correctTargetAmount }
        });
        
        // 2. Find and update the credit transaction (DEPOSIT)
        // Usually created right at the same time as the FxSwap
        const creditTx = await prisma.transaction.findFirst({
          where: {
            userId: swap.userId,
            walletId: swap.targetWalletId,
            type: 'DEPOSIT',
            amount: 0,
            category: 'FX_SWAP',
            createdAt: {
              gte: new Date(swap.createdAt.getTime() - 5000), // Within 5 seconds
              lte: new Date(swap.createdAt.getTime() + 5000)
            }
          }
        });

        if (creditTx) {
          await prisma.transaction.update({
            where: { id: creditTx.id },
            data: { amount: correctTargetAmount }
          });
        }
        
        // 3. Update wallet balance
        const wallet = await prisma.wallet.findFirst({
          where: { userId: swap.userId, currency: swap.targetCurrency as any }
        });
        
        if (wallet) {
          await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: correctTargetAmount } }
          });
          details.push(`Swap ${swap.id} fixed: Credited ${correctTargetAmount} to wallet ${wallet.id}`);
        }
        fixedCount++;
      }
    }
    res.json({ message: `Fixed ${fixedCount} swaps`, details });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Paypee Core API running on http://localhost:${PORT}`);
});
server.timeout = 1800000; // 30 minutes
