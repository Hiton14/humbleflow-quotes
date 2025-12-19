# HumbleFlow Quotes - Integrated Deployment Guide

## Overview
This application uses an integrated deployment architecture where:
- **Express Backend** (port 3000): Serves API + Storefront static files + Proxies admin requests
- **Next.js Admin** (port 3001): Runs as a separate process, accessed via proxy
- **MongoDB**: Database backend

## Architecture

```
User Request
    ↓
Express Server (Port 3000)
    ├── /api/* → API Routes
    ├── /uploads/* → Static uploads
    ├── /admin/* → Proxy to Next.js (Port 3001)
    └── /* → Storefront (React SPA)
```

## Production Deployment

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm package manager

### Step 1: Install Dependencies

```bash
# Root dependencies
npm install

# Admin dependencies
cd admin && npm install && cd ..
```

### Step 2: Configure Environment

Create `.env` file in the root:

```bash
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/humbleflow
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
```

### Step 3: Build Applications

```bash
# Build storefront (outputs to dist/public)
npm run build:storefront

# Admin runs in production mode (no build needed)
# The Next.js server will run directly
```

### Step 4: Start Production Servers

```bash
npm start
```

This command:
1. Starts Next.js admin server on port 3001
2. Starts Express backend on port 3000 (proxies /admin to Next.js)
3. Serves storefront from dist/public

## Access Points

Once running, access the application at:
- **Storefront**: http://localhost:3000/
- **Admin Dashboard**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

## Admin Credentials

Default admin (created via seed):
- Email: `admin@humbleflow.com`
- Password: `admin`

**⚠️ CHANGE THESE IN PRODUCTION!**

## Process Management

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "humbleflow" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Manual Management

The `npm start` command runs both servers. To stop:
- Press `Ctrl+C` (graceful shutdown)

## Deployment to VPS/Cloud

### Option 1: Traditional VPS

1. **Setup Server** (Ubuntu/Debian example):
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# Follow: https://docs.mongodb.com/manual/installation/
```

2. **Deploy Application**:
```bash
# Clone/upload your code
git clone your-repo-url
cd humbleflow-quotes

# Install dependencies
npm install
cd admin && npm install && cd ..

# Build storefront
npm run build:storefront

# Configure environment
cp .env.production .env
# Edit .env with your settings

# Start with PM2
pm2 start npm --name "humbleflow" -- start
```

3. **Setup Nginx (Optional but recommended)**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY admin/package*.json ./admin/

# Install dependencies
RUN npm install
RUN cd admin && npm install

# Copy application code
COPY . .

# Build storefront
RUN npm run build:storefront

EXPOSE 3000 3001

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/humbleflow
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

Deploy with:
```bash
docker-compose up -d
```

## Database Setup

### Local MongoDB
```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Seed admin user
npx tsx server/seedAdmin.ts
```

### MongoDB Atlas (Cloud)
1. Create cluster at mongodb.com
2. Get connection string
3. Update `MONGODB_URI` in `.env`
4. Whitelist your server IP

## Troubleshooting

### Servers Won't Start
- Check MongoDB is running
- Verify `.env` configuration
- Ensure ports 3000 and 3001 are available
- Check logs for specific errors

### Admin Dashboard Not Loading
- Verify Next.js server is running on port 3001
- Check Express proxy configuration
- Ensure `basePath: '/admin'` in next.config.ts

### Storefront Not Loading
- Verify build completed: check `dist/public` exists
- Ensure `NODE_ENV=production` is set
- Check Express static file serving

## Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS (use Let's Encrypt with Nginx)
- [ ] Configure CORS properly for your domain
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database authentication enabled
- [ ] Environment variables secured
- [ ] Rate limiting on API endpoints

## Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok","database":"connected"}
```

### Logs
```bash
# PM2 logs
pm2 logs humbleflow

# Follow logs in real-time
pm2 logs humbleflow --lines 100
```

## Backup & Maintenance

### Database Backup
```bash
# Export
mongodump --uri="your-mongodb-uri" --out=/backup/path

# Restore
mongorestore --uri="your-mongodb-uri" /backup/path
```

### Application Updates
```bash
# Pull latest code
git pull

# Install new dependencies
npm install
cd admin && npm install && cd ..

# Rebuild storefront
npm run build:storefront

# Restart application
pm2 restart humbleflow
```

## Support

For issues or questions, refer to the project repository or contact the development team.
