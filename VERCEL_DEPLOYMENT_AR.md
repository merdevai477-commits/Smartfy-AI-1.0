# 🚀 دليل رفع التطبيق على Vercel

## نظرة عامة

هنرفع التطبيق كله (Frontend + Backend) على Vercel من ريبو GitHub واحد.

---

## 📋 المتطلبات

1. حساب على [Vercel](https://vercel.com) (مجاني)
2. الريبو على GitHub
3. MongoDB Atlas جاهز
4. Clerk API Keys

---

## 🎯 الخطوة 1: تجهيز الريبو

### تأكد من الملفات دي موجودة:

#### 1. ملف `vercel.json` في الجذر الرئيسي

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/dist/server.js"
    },
    {
      "src": "/health",
      "dest": "backend/dist/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

#### 2. ملف `backend/.env.production` (للمرجعية فقط - مش هنرفعه)

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_live_...
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=https://smartfyai.vercel.app,https://smartfyai.com
```

#### 3. ملف `frontend/.env.production`

```env
NEXT_PUBLIC_API_URL=https://smartfyai.vercel.app
NEXT_PUBLIC_APP_NAME=SmartfyAI
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

---

## 🚀 الخطوة 2: رفع على Vercel

### الطريقة الأولى: من Dashboard Vercel (الأسهل)

1. **افتح [Vercel Dashboard](https://vercel.com/dashboard)**

2. **اضغط "Add New" → "Project"**

3. **اختار الريبو من GitHub:**
   - لو أول مرة، اضغط "Import Git Repository"
   - اختار `Smartfy-AI-1.0` من القائمة
   - اضغط "Import"

4. **إعدادات المشروع:**

   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: cd backend && npm install --legacy-peer-deps && npm run build
   Output Directory: backend/dist
   Install Command: npm install --legacy-peer-deps
   ```

5. **Environment Variables (متغيرات البيئة):**
   
   اضغط "Environment Variables" وأضف:

   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartfyai
   CLERK_SECRET_KEY=sk_live_...
   GROQ_API_KEY=gsk_...
   ALLOWED_ORIGINS=https://smartfyai.vercel.app,https://smartfyai.com
   
   # Frontend Variables
   NEXT_PUBLIC_API_URL=https://smartfyai.vercel.app
   NEXT_PUBLIC_APP_NAME=SmartfyAI
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   ```

6. **اضغط "Deploy"** 🚀

---

### الطريقة الثانية: من Terminal (للمحترفين)

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# من مجلد المشروع
cd /path/to/Smartfy-AI-1.0

# Deploy
vercel

# اتبع التعليمات:
# - Set up and deploy? Yes
# - Which scope? (اختار حسابك)
# - Link to existing project? No
# - Project name? smartfy-ai
# - Directory? ./
# - Override settings? Yes
#   - Build Command: cd backend && npm install --legacy-peer-deps && npm run build
#   - Output Directory: backend/dist
#   - Development Command: npm run start:dev

# بعد النشر الأول، أضف المتغيرات:
vercel env add MONGODB_URI
vercel env add CLERK_SECRET_KEY
vercel env add GROQ_API_KEY
# ... إلخ

# Deploy مرة تانية بالمتغيرات
vercel --prod
```

---

## 🔧 الخطوة 3: إعداد خاص للـ Monorepo

### مشكلة: Vercel مش بيدعم Monorepo بشكل مباشر

**الحل: هنعدل الإعدادات شوية**

#### تعديل `package.json` في الجذر الرئيسي

أنشئ ملف `package.json` في الجذر:

```json
{
  "name": "smartfy-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "cd backend && npm install --legacy-peer-deps && npm run build",
    "start": "cd backend && npm start"
  },
  "workspaces": [
    "backend",
    "frontend"
  ]
}
```

#### تعديل `vercel.json` في الجذر

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/package.json",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["backend/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/dist/server.js"
    },
    {
      "src": "/health",
      "dest": "backend/dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 🎯 الخطوة 4: ربط الدومين المخصص

### من Vercel Dashboard:

1. اذهب لمشروعك → **Settings** → **Domains**
2. اضغط **Add Domain**
3. أدخل: `smartfyai.com`
4. اضغط **Add**

### تحديث DNS في لوحة تحكم الدومين:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

أو استخدم Vercel Nameservers:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

## ✅ الخطوة 5: التحقق من النشر

### اختبار API:

```bash
# Health Check
curl https://smartfyai.vercel.app/health

# API Endpoint
curl https://smartfyai.vercel.app/api/v1/users
```

### اختبار Frontend:

افتح المتصفح: `https://smartfyai.vercel.app`

---

## 🔄 التحديثات التلقائية

Vercel بيعمل deploy تلقائي لما تعمل push على GitHub:

```bash
# على جهازك
git add .
git commit -m "Update: ..."
git push origin main

# Vercel هيعمل deploy تلقائياً! 🎉
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة 1: Build Failed

**السبب:** مشكلة في تثبيت المكتبات

**الحل:**
```bash
# في Build Command
cd backend && rm -rf node_modules && npm install --legacy-peer-deps && npm run build
```

### المشكلة 2: API مش شغال

**السبب:** المتغيرات مش متضافة

**الحل:**
1. Vercel Dashboard → Project → Settings → Environment Variables
2. تأكد من كل المتغيرات موجودة
3. Redeploy

### المشكلة 3: CORS Error

**السبب:** الدومين مش في `ALLOWED_ORIGINS`

**الحل:**
```env
ALLOWED_ORIGINS=https://smartfyai.vercel.app,https://smartfyai.com,https://www.smartfyai.com
```

### المشكلة 4: MongoDB Connection Failed

**السبب:** Vercel IP مش مسموح في MongoDB Atlas

**الحل:**
1. MongoDB Atlas → Network Access
2. أضف: `0.0.0.0/0` (Allow from anywhere)
3. أو أضف Vercel IPs

### المشكلة 5: Frontend مش بيتصل بـ Backend

**السبب:** `NEXT_PUBLIC_API_URL` غلط

**الحل:**
```env
# في Vercel Environment Variables
NEXT_PUBLIC_API_URL=https://smartfyai.vercel.app
```

---

## 📊 مراقبة الأداء

### من Vercel Dashboard:

1. **Analytics:** شوف عدد الزيارات والأداء
2. **Logs:** شوف اللوجات المباشرة
3. **Deployments:** شوف تاريخ النشر

### أوامر CLI:

```bash
# عرض اللوجات
vercel logs

# عرض معلومات المشروع
vercel inspect

# عرض قائمة النشر
vercel ls
```

---

## 💡 نصائح مهمة

1. **استخدم Environment Variables** - مش تحط الـ secrets في الكود
2. **فعّل Automatic Deployments** - كل push يعمل deploy تلقائي
3. **استخدم Preview Deployments** - كل branch ليه رابط خاص للاختبار
4. **راقب الـ Logs** - عشان تعرف المشاكل بسرعة
5. **استخدم Edge Functions** - لو محتاج performance أحسن

---

## 🎯 الخلاصة

### المميزات:
✅ Deploy تلقائي من GitHub
✅ SSL مجاني
✅ CDN عالمي سريع
✅ Preview deployments لكل branch
✅ Logs وAnalytics مجانية
✅ Zero configuration تقريباً

### العيوب:
❌ Serverless functions ليها حدود (10 ثانية timeout في Free tier)
❌ مش مناسب للـ WebSockets
❌ Cold starts ممكن تكون بطيئة شوية

---

## 📞 محتاج مساعدة؟

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

---

**آخر تحديث:** فبراير 2026  
**الإصدار:** 1.0 - دليل Vercel الكامل بالعربي

