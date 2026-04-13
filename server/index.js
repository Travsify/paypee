"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'paypee_super_secret_dev_key';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'live', service: 'paypee-core-api', timestamp: new Date() });
});
// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Access token missing' });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ error: 'Token is invalid or expired' });
        req.user = user;
        next();
    });
};
// ==========================================
// Authentication Routes
// ==========================================
app.post('/api/auth/register', async (req, res) => {
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
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Create user internally
        const userRole = role.toUpperCase();
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
});
app.post('/api/auth/login', async (req, res) => {
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
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        // Issue token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, role: user.role, kycStatus: user.kycStatus }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login.' });
    }
});
// ==========================================
// Protected User Data Routes
// ==========================================
app.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, email: true, role: true, kycStatus: true, createdAt: true }
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Fetch associated wallets
        const wallets = await prisma.wallet.findMany({ where: { userId: user.id } });
        res.json({ ...user, wallets });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Paypee Core API running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map