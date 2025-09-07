# 🚀 Railway Deployment Guide (Alternative to Vercel)

## 🎯 Why Railway?

Railway is often more reliable for Node.js backends than Vercel:
- ✅ **Better Node.js support**
- ✅ **More reliable deployments**
- ✅ **Easier environment variable management**
- ✅ **No 404 routing issues**

## 🚀 Step-by-Step Railway Deployment

### **Step 1: Deploy Backend to Railway**

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `Thomas542-ai/b2b`
6. **Railway will automatically detect** it's a Node.js project

### **Step 2: Configure Railway Environment Variables**

In Railway dashboard, go to your project → Variables tab and add:

```env
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend-domain.netlify.app

# Supabase Configuration
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZdeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZdeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo

# JWT Configuration
JWT_SECRET=Frj6qu8lE6/KbmFGyasbvFlaF9Jw1TgLShxwdrJDgchFG0g39Xf5Pd/FTxh7gxgAv17l8zBFdWzQvHtUtMnBlg==
JWT_EXPIRES_IN=7d
```

### **Step 3: Deploy Frontend to Netlify**

1. **Go to Netlify**: https://netlify.com
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Choose your repository**: `Thomas542-ai/b2b`
5. **Configure build settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### **Step 4: Configure Frontend Environment Variables**

In Netlify dashboard, go to Site settings → Environment variables and add:

```env
VITE_API_URL=https://your-railway-backend-url.railway.app/api
VITE_APP_NAME=LeadsFynder
VITE_APP_VERSION=1.0.0
```

### **Step 5: Update Backend CORS**

After getting your Netlify URL, update the `FRONTEND_URL` in Railway:
```
FRONTEND_URL=https://your-site-name.netlify.app
```

## 🧪 Test Your Deployment

### **Test Backend**
```bash
curl https://your-railway-backend.railway.app/api/health
```

### **Test Frontend**
Visit: `https://your-site-name.netlify.app`

### **Test Authentication**
1. Try registering a new account
2. Try logging in
3. Check if the dashboard loads

## ✅ Expected Results

After Railway deployment:

✅ **No 404 errors**
✅ **API endpoints respond correctly**
✅ **Login/registration works**
✅ **Supabase connection established**
✅ **User data stored in database**

## 🎯 Advantages of Railway

### **vs Vercel:**
- ✅ **Better Node.js support**
- ✅ **No routing configuration needed**
- ✅ **More reliable deployments**
- ✅ **Easier environment management**

### **vs Other Platforms:**
- ✅ **Free tier available**
- ✅ **Automatic deployments**
- ✅ **Built-in monitoring**
- ✅ **Easy scaling**

## 🚀 Quick Start

1. **Deploy backend to Railway** (5 minutes)
2. **Deploy frontend to Netlify** (5 minutes)
3. **Configure environment variables** (2 minutes)
4. **Test your application** (1 minute)

**Total time**: ~13 minutes for a working deployment!

Railway will solve your 404 errors and provide a more reliable backend deployment! 🎉
