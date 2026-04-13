import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, AccountRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const { email, password, role } = req.body;

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

    // Create user internally
    const userRole = role.toUpperCase() as AccountRole;
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: userRole,
      }
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
      select: { id: true, email: true, role: true, kycStatus: true, createdAt: true }
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
    const cardNumber = "4242" + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    const cvv = Math.floor(Math.random() * 900 + 100).toString();
    const expiry = "12/28";

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

    // Update wallet balance for deposits
    if (type === 'DEPOSIT') {
      await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { increment: amount } }
      });
    } else if (type === 'WITHDRAWAL' || type === 'TRANSFER') {
       if (wallet.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
       await prisma.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } }
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
});

app.listen(PORT, () => {
  console.log(`🚀 Paypee Core API running on http://localhost:${PORT}`);
});
