# Deploying to Render.com

Since this is now a static site served by a simple Express server, **Render is an excellent choice**.

## Why it's suitable now
- **No Database**: We removed MongoDB/Mongoose. Zero database configuration needed.
- **No CMS**: We removed the complex Sanity/Next.js setup.
- **Single Service**: Just one "Web Service" running Node.js.

## Deployment Steps

### 1. Push Code to GitHub
Ensure all your changes (including `package.json` updates) are committed and pushed.

### 2. Create Web Service on Render
1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Select your repository `humbleflow-quotes`.
4.  Configure the service:
    -   **Name**: `humbleflow-quotes` (or any name)
    -   **Runtime**: **Node**
    -   **Build Command**: `npm run build`
    -   **Start Command**: `npm start`
    -   **Plan**: Free (or Starter)

### 3. Environment Variables
You likely don't need any for this static version!
-   If you have specific runtime flags, add them here.
-   But `PORT` is automatically handled by Render.

### 4. Deploy
Click **Create Web Service**.

Render will:
1.  Clone your repo.
2.  Run `npm install` (installing dependencies).
3.  Run `npm run build` (creating `dist/public` and `dist/server`).
4.  Run `npm start` (starting `dist/server/index.js`).

Your site should live at `https://your-app-name.onrender.com`.
