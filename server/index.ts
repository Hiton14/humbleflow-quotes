import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';

import path from 'path';

import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not defined in the environment.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Provide access to uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'server/uploads')));

// Proxy admin requests to Next.js server in production
if (process.env.NODE_ENV === 'production') {
  const { createProxyMiddleware } = require('http-proxy-middleware');

  app.use('/admin', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    ws: true,
  }));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Serve storefront static files (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist/public')));

  // SPA fallback for storefront
  app.get(/^\/(?!api|uploads|admin).*/, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
