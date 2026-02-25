#!/bin/bash

# ============================================
# Smartfy AI - Hostinger Deployment Script
# ============================================
# Run this script on your Hostinger server after pushing to GitHub

set -e

echo "🚀 Starting Smartfy AI deployment on Hostinger..."

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main || git pull origin master

# Backend deployment
echo ""
echo "🔧 Setting up Backend..."
cd backend

# Clean install dependencies (remove old node_modules and lock file)
echo "🧹 Cleaning old dependencies..."
rm -rf node_modules package-lock.json

echo "📦 Installing backend dependencies..."
npm install --legacy-peer-deps || {
    echo "❌ Error: Failed to install backend dependencies"
    exit 1
}

# Build backend and frontend
echo "🏗️  Building application..."
npm run build || {
    echo "❌ Error: Build failed"
    exit 1
}

# Setup PM2 if not already running
echo ""
echo "🔄 Setting up PM2 process manager..."

# Stop existing process if running
pm2 stop smartfy-backend 2>/dev/null || echo "No existing process to stop"
pm2 delete smartfy-backend 2>/dev/null || echo "No existing process to delete"

# Start the application
echo "▶️  Starting application with PM2..."
pm2 start dist/main.js --name smartfy-backend --time

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (run once)
pm2 startup || echo "⚠️  PM2 startup already configured"

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "📋 Useful Commands:"
echo "  View logs:     pm2 logs smartfy-backend"
echo "  Restart app:   pm2 restart smartfy-backend"
echo "  Stop app:      pm2 stop smartfy-backend"
echo "  Monitor:       pm2 monit"
echo ""
echo "🌐 Your application should be running at: https://smartfyai.com"
echo ""
echo "⚠️  Important: Make sure Nginx is configured to proxy to port 3000"
echo "   If not configured yet, check DEPLOYMENT_GUIDE.md for Nginx setup"
