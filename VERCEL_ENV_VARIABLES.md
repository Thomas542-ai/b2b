# 🔐 Vercel Environment Variables Setup

## Your Actual Environment Variables

Based on your `env.local` file, here are the **exact environment variables** you need to add to Vercel:

### For Vercel Dashboard → Settings → Environment Variables

```env
# Server Configuration
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://b2b-6g6r.vercel.app

# Supabase Configuration
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZdeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZdeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo

# JWT Configuration - YOUR ACTUAL JWT SECRET
JWT_SECRET=Frj6qu8lE6/KbmFGyasbvFlaF9Jw1TgLShxwdrJDgchFG0g39Xf5Pd/FTxh7gxgAv17l8zBFdWzQvHtUtMnBlg==
JWT_EXPIRES_IN=7d
```

## 🎯 Key Points

### ✅ Your JWT Secret
- **Your actual JWT secret**: `Frj6qu8lE6/KbmFGyasbvFlaF9Jw1TgLShxwdrJDgchFG0g39Xf5Pd/FTxh7gxgAv17l8zBFdWzQvHtUtMnBlg==`
- This is the same value from your `env.local` file
- This will ensure your JWT tokens work correctly

### ✅ Supabase Configuration
- **URL**: Your existing Supabase project
- **Keys**: Your existing Supabase keys
- **Connection**: Will work with your current database

### ✅ Frontend URL
- **Updated**: Points to your Vercel frontend URL
- **CORS**: Allows your frontend to communicate with backend

## 🚀 How to Add to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `b2b-6g6r`
3. **Go to Settings → Environment Variables**
4. **Add each variable** from the list above
5. **Redeploy** your project

## 🔒 Security Notes

- **JWT_SECRET**: Keep this secret (server-side only)
- **SUPABASE_SERVICE_ROLE_KEY**: Keep this secret (server-side only)
- **SUPABASE_URL & SUPABASE_ANON_KEY**: Can be public (client-side safe)

## ✅ After Setup

Once you add these environment variables and redeploy:

1. **404 errors will disappear**
2. **API endpoints will work**
3. **Authentication will work with your JWT secret**
4. **Supabase connection will be established**

Your application will work exactly as it does locally, but now on Vercel! 🎉
