# 🚀 Smartfy AI - Deployment Guide

## Prerequisites

- GitHub account
- Hostinger VPS/Cloud hosting
- Node.js 18+ installed on server
- MongoDB Atlas account
- Groq API key (free from https://console.groq.com/)

## Step 1: Push to GitHub

On your local machine:

```bash
# Make the deploy script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

This will:
- Commit all your changes
- Push to GitHub

## Step 2: Setup Hostinger Server

### 2.1 SSH into your server

```bash
ssh your-username@your-server-ip
```

### 2.2 Clone the repository (first time only)

```bash
cd /path/to/your/apps
git clone https://github.com/your-username/smartfy-ai.git
cd smartfy-ai
```

### 2.3 Create production environment file

```bash
cd backend
cp .env.production.example .env
nano .env
```

Add your actual values:
```env
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
```

Save and exit (Ctrl+X, Y, Enter)

## Step 3: Deploy

### 3.1 Make deploy script executable

```bash
cd /path/to/smartfy-ai
chmod +x hostinger-deploy.sh
```

### 3.2 Run deployment

```bash
./hostinger-deploy.sh
```

This will:
- Pull latest code
- Install dependencies
- Build frontend
- Build backend
- Restart application

## Step 4: Setup PM2 (Process Manager)

### 4.1 Install PM2 globally

```bash
npm install -g pm2
```

### 4.2 Start application

```bash
cd backend
pm2 start dist/main.js --name smartfy-ai
pm2 save
pm2 startup
```

### 4.3 Useful PM2 commands

```bash
pm2 status              # Check status
pm2 logs smartfy-ai     # View logs
pm2 restart smartfy-ai  # Restart app
pm2 stop smartfy-ai     # Stop app
pm2 delete smartfy-ai   # Remove app
```

## Step 5: Setup Nginx (Reverse Proxy)

### 5.1 Create Nginx config

```bash
sudo nano /etc/nginx/sites-available/smartfy-ai
```

Add:
```nginx
server {
    listen 80;
    server_name smartfyai.com www.smartfyai.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 5.2 Enable site

```bash
sudo ln -s /etc/nginx/sites-available/smartfy-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 6: Setup SSL (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d smartfyai.com -d www.smartfyai.com
```

## Future Deployments

For future updates, just run:

### On your local machine:
```bash
./deploy.sh
```

### On Hostinger server:
```bash
cd /path/to/smartfy-ai
./hostinger-deploy.sh
```

## Troubleshooting

### Check logs
```bash
pm2 logs smartfy-ai
```

### Check if app is running
```bash
pm2 status
curl http://localhost:3000/api/health
```

### Restart everything
```bash
pm2 restart smartfy-ai
sudo systemctl restart nginx
```

## Environment Variables Checklist

Make sure these are set in `backend/.env`:

- ✅ CLERK_SECRET_KEY
- ✅ CLERK_PUBLISHABLE_KEY
- ✅ MONGODB_URI
- ✅ GROQ_API_KEY
- ✅ NODE_ENV=production
- ✅ PORT=3000
- ✅ FRONTEND_URL

## Support

If you encounter any issues:
1. Check PM2 logs: `pm2 logs smartfy-ai`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Ensure MongoDB connection is working
5. Verify Groq API key is valid

---

🎉 Your Smartfy AI is now live!
