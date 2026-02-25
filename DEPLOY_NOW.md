# 🚀 Smartfy AI - Quick Deployment Guide

## Domain: https://smartfyai.com

---

## Step 1: Deploy from Local Machine

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

This will:
- Commit all your changes
- Push to GitHub
- Show you the next steps

---

## Step 2: Deploy on Hostinger Server

### 2.1 SSH to Server
```bash
ssh u169609494@156.67.218.107
```

### 2.2 Navigate to Project
```bash
cd domains/smartfyai.com/public_html
```

### 2.3 Make Script Executable (First Time Only)
```bash
chmod +x hostinger-deploy.sh
```

### 2.4 Run Deployment
```bash
./hostinger-deploy.sh
```

This will:
- Pull latest code from GitHub
- Clean install dependencies (fixes MongoDB conflict)
- Build frontend and backend
- Start/restart the app with PM2

---

## Step 3: Verify Deployment

### Check Application Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs smartfy-backend
```

### Monitor in Real-time
```bash
pm2 monit
```

---

## 🔧 Useful PM2 Commands

```bash
# Restart application
pm2 restart smartfy-backend

# Stop application
pm2 stop smartfy-backend

# View detailed logs
pm2 logs smartfy-backend --lines 100

# Clear logs
pm2 flush
```

---

## 🌐 Access Your Application

**Frontend:** https://smartfyai.com  
**Backend API:** https://smartfyai.com/api

---

## ⚠️ Important Notes

1. **MongoDB Connection**: Make sure your MongoDB Atlas allows connections from Hostinger IP
2. **Environment Variables**: Verify `.env` file exists in `backend/` directory
3. **Nginx Configuration**: Must be set up to proxy requests to port 3000
4. **SSL Certificate**: Should be configured with Certbot for HTTPS

---

## 🆘 Troubleshooting

### Application Not Starting?
```bash
# Check logs
pm2 logs smartfy-backend --err

# Check if port 3000 is in use
netstat -tulpn | grep 3000

# Restart PM2
pm2 restart smartfy-backend
```

### Build Errors?
```bash
# Clean and rebuild
cd backend
rm -rf node_modules package-lock.json dist
npm install --legacy-peer-deps
npm run build
```

### Frontend Not Loading?
```bash
# Check if files exist
ls -la backend/public/

# Rebuild frontend only
cd frontend
npm install
npm run build
```

---

## 📞 Need Help?

Check the full deployment guide: `DEPLOYMENT_GUIDE.md`

---

**Last Updated:** February 23, 2026  
**Version:** 2.0 - Fixed MongoDB Dependencies
