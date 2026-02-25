# 🔀 دليل فصل Frontend و Backend

## السيناريو: Frontend على Vercel/Netlify، Backend على Hostinger

---

## 📋 الإعداد المطلوب

### 1. إعداد Backend (Hostinger)

#### تعديل `backend/package.json`

```json
{
  "scripts": {
    "build": "npm run build:api",
    "build:api": "tsc -p tsconfig.express.json"
  }
}
```

#### تعديل `backend/.env`

```env
NODE_ENV=production
PORT=3000

# السماح للـ Frontend من دومين مختلف
ALLOWED_ORIGINS=https://smartfyai.com,https://www.smartfyai.com,https://smartfyai.vercel.app

MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_live_...
GROQ_API_KEY=gsk_...
```

#### تعديل Nginx للـ API فقط

```nginx
server {
    listen 443 ssl http2;
    server_name api.smartfyai.com;

    ssl_certificate /etc/letsencrypt/live/api.smartfyai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.smartfyai.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 2. إعداد Frontend (Vercel/Netlify)

#### إنشاء ريبو منفصل للـ Frontend

```bash
# على جهازك
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/yourusername/smartfyai-frontend.git
git push -u origin main
```

#### تعديل `frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://api.smartfyai.com/api/v1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

#### تعديل `frontend/src/api/client.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = {
  baseURL: API_BASE_URL,
  // ... باقي الكود
};
```

---

### 3. Deploy Frontend على Vercel

#### من Dashboard Vercel:

1. اضغط "New Project"
2. اختار الريبو: `smartfyai-frontend`
3. Framework Preset: Next.js
4. Root Directory: `./`
5. Build Command: `npm run build`
6. Output Directory: `.next`
7. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.smartfyai.com/api/v1
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   ```
8. اضغط Deploy

#### ربط الدومين:

1. من Vercel Dashboard → Settings → Domains
2. أضف: `smartfyai.com` و `www.smartfyai.com`
3. اتبع التعليمات لتحديث DNS

---

### 4. Deploy Backend على Hostinger

```bash
# SSH للسيرفر
ssh u169609494@156.67.218.107

cd domains/smartfyai.com/public_html/backend

# تحديث الكود
git pull origin main

# تثبيت المكتبات
npm install --legacy-peer-deps

# بناء Backend فقط
npm run build:api

# إعادة تشغيل
pm2 restart smartfy-backend
```

---

## 🔧 إعداد DNS

### في لوحة تحكم الدومين:

```
# Frontend على Vercel
smartfyai.com        A      76.76.21.21 (Vercel IP)
www.smartfyai.com    CNAME  cname.vercel-dns.com

# Backend على Hostinger
api.smartfyai.com    A      156.67.218.107 (Hostinger IP)
```

---

## ✅ المميزات

- Frontend أسرع (Vercel CDN)
- Deployments مستقلة
- تحديثات Frontend بدون إعادة تشغيل Backend
- Scaling أفضل

## ❌ العيوب

- إعداد أعقد
- محتاج subdomain للـ API
- مشاكل CORS محتملة
- تكلفة إضافية (لو Vercel مش Free Tier)

---

## 🎯 التوصية

**ابدأ بالـ Monorepo** (كل حاجة على Hostinger)، ولو التطبيق كبر أو محتاج performance أحسن، وقتها افصلهم.

الإعداد الحالي بتاعك مثالي للبداية! 🚀
