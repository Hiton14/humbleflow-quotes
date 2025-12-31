// Final deployment - Static Site Serving
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', type: 'static-site-server' });
});

// Serve storefront static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist/public')));


  // SPA fallback for storefront
  app.use((req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

