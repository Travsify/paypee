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

app.listen(PORT, () => {
  console.log(`🚀 Paypee Core API running on http://localhost:${PORT}`);
});
