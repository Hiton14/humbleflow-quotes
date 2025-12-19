import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not defined in the environment.');
    process.exit(1);
}

// POST /api/auth/register (For initial setup only - in prod we might disable this or protect it)
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            passwordHash,
            role: role || 'user'
        });

        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

import crypto from 'crypto';

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists for security, just say "If account exists..."
            return res.json({ message: 'If an account with that email exists, a reset link has been generated.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        // LOGGING TOKEN FOR DEV/ADMIN (Since we lack email service)
        console.log('-------------------------------------------');
        console.log(`PASSWORD RESET REQUEST FOR: ${email}`);
        console.log(`RESET TOKEN: ${token}`);
        console.log(`RESET URL: ${req.headers.origin}/admin/reset-password?token=${token}`);
        console.log('-------------------------------------------');

        res.json({ message: 'If an account with that email exists, a reset link has been generated.' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;
