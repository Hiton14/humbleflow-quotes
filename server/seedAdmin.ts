import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humbleflow';

async function seedAdmin() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@humbleflow.com';
    const password = 'admin';

    const existing = await User.findOne({ email });
    if (existing) {
        console.log('Admin user already exists');
    } else {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            passwordHash,
            role: 'admin'
        });
        await user.save();
        console.log('Admin user created');
    }

    await mongoose.disconnect();
}

seedAdmin().catch(console.error);
