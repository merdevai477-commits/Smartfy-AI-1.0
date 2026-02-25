#!/bin/bash

# ============================================
# Smartfy AI - Deploy to GitHub
# ============================================
# This script commits and pushes all changes to GitHub
# After running this, SSH to Hostinger and run hostinger-deploy.sh

set -e

echo "🚀 Starting deployment to GitHub..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-repo-url>"
    exit 1
fi

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "💾 Committing changes..."
git commit -m "Deploy: $TIMESTAMP - Removed TypeORM, cleaned dependencies, ready for production" || {
    echo "⚠️  No changes to commit or commit failed"
}

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main || git push origin master || {
    echo "❌ Error: Failed to push to GitHub"
    echo "Make sure you have set up your remote repository:"
    echo "   git remote add origin <your-repo-url>"
    exit 1
}

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. SSH to your Hostinger server:"
echo "   ssh u169609494@156.67.218.107"
echo ""
echo "2. Navigate to your project directory:"
echo "   cd domains/smartfyai.com/public_html"
echo ""
echo "3. Run the deployment script:"
echo "   bash hostinger-deploy.sh"
echo ""
echo "🌐 Your domain: https://smartfyai.com"
