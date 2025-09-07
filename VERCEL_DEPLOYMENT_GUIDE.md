# 🚀 Vercel Deployment Guide for LeadsFynder

## Current Situation Analysis

Based on your screenshots and the error messages, here's what's happening:

### ✅ What's Working
- Your **backend is running locally** on port 8000 (as shown by the "address already in use" error)
- All API routes are properly mapped and working
- Supabase integration is configured correctly
- Authentication endpoints are functional

### ❌ The Problem
- Your **frontend is trying to connect to a Vercel-deployed backend**
- The Vercel backend URL in your frontend is: `https://b2b-6g6r-1m2j74icj-thomas-roberts-projects-9cb4d6f1.vercel.app`
- This Vercel backend is returning 405 errors, meaning it's not properly configured

## 🔧 Solution Options

### Option 1: Fix Vercel Backend Deployment (Recommended)

#### Step 1: Update Vercel Environment Variables
In your Vercel dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend-domain.vercel.app
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo
JWT_SECRET=leadsfynder-jwt-secret-key-2025
JWT_EXPIRES_IN=7d
```

#### Step 2: Create Vercel Configuration
Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Step 3: Update Frontend API URL
Update your frontend environment to point to the correct Vercel backend:

```env
VITE_API_URL=https://b2b-6g6r-1m2j74icj-thomas-roberts-projects-9cb4d6f1.vercel.app/api
```

### Option 2: Use Local Development (Quick Fix)

#### Step 1: Update Frontend Environment
Change your frontend `.env` file to use local backend:

```env
VITE_API_URL=http://localhost:8000/api
```

#### Step 2: Start Both Services
```bash
# Terminal 1: Backend (already running)
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

#### Step 3: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api

### Option 3: Deploy to Railway (Alternative)

If Vercel continues to have issues, consider deploying to Railway:

#### Step 1: Deploy Backend to Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend with environment variables
4. Get your Railway backend URL

#### Step 2: Update Frontend
Update frontend environment to use Railway backend:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

## 🎯 Recommended Approach

### For Immediate Testing (Option 2)
Use local development to test your application right now:

1. **Keep your backend running** (it's already working)
2. **Update frontend environment** to use localhost
3. **Start frontend** and test authentication
4. **Verify everything works** before deploying

### For Production (Option 1)
Fix your Vercel deployment:

1. **Add environment variables** to Vercel
2. **Create vercel.json** configuration
3. **Redeploy** your backend
4. **Update frontend** to use Vercel backend
5. **Test production** deployment

## 🔍 Debugging Steps

### Check Vercel Backend Status
```bash
curl https://b2b-6g6r-1m2j74icj-thomas-roberts-projects-9cb4d6f1.vercel.app/api/health
```

### Check Local Backend Status
```bash
curl http://localhost:8000/api/health
```

### Test Authentication Endpoints
```bash
# Test registration
curl -X POST https://your-backend-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User","company":"Test Company"}'

# Test login
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🚀 Quick Start (Local Development)

1. **Backend is already running** ✅
2. **Update frontend environment**:
   ```bash
   cd frontend
   echo "VITE_API_URL=http://localhost:8000/api" > .env
   ```
3. **Start frontend**:
   ```bash
   npm run dev
   ```
4. **Test your application** at http://localhost:3000

Your authentication should work perfectly now! 🎉
