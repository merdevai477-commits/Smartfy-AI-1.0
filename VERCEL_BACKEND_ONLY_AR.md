# 🚀 رفع Backend فقط على Vercel (الحل الأبسط)

## الفكرة
نرفع الـ Backend بس على Vercel، والـ Frontend نرفعه بعدين أو على خدمة تانية.

---

## 📋 الخطوات

### 1. في Vercel Dashboard:

**إعدادات المشروع:**

```
Framework Preset: Other
Root Directory: backend
Build Command: npm install --legacy-peer-deps && npm run build:api
Output Directory: dist
Install Command: npm install --legacy-peer-deps
```

### 2. Environment Variables:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartfyai
CLERK_SECRET_KEY=sk_live_...
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=*
```

### 3. Deploy!

اضغط **Deploy** وخلاص! 🎉

---

## ✅ المميزات

- أبسط بكتير
- مفيش تعقيدات Monorepo
- الـ Backend هيشتغل على طول
- رابط API جاهز: `https://your-project.vercel.app/api/v1/...`

---

## 🔄 بعد كده

لما الـ Backend يشتغل، ممكن ترفع الـ Frontend على:
- Vercel (مشروع منفصل)
- Netlify
- Hostinger
- أي خدمة استضافة تانية

---

**جرب الطريقة دي - أسهل وأسرع!** 🚀
