# 🚀 Vercel + Supabase Connection Guide

## ✅ Yes, You Can Connect to Supabase on Vercel!

Your LeadsFynder project is already configured to work with Supabase, but you need to set up the environment variables correctly in Vercel.

## 🔧 Required Vercel Configuration

### Step 1: Add Environment Variables to Vercel

In your Vercel dashboard, go to your project settings and add these environment variables:

```env
# Supabase Configuration
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo

# JWT Configuration
JWT_SECRET=leadsfynder-jwt-secret-key-2025
JWT_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Step 2: Create Vercel Configuration File

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

### Step 3: Update Frontend Environment

Update your frontend environment variables in Vercel:

```env
VITE_API_URL=https://your-backend-domain.vercel.app/api
VITE_APP_NAME=LeadsFynder
VITE_APP_VERSION=1.0.0
```

## 🎯 How Supabase Connection Works on Vercel

### ✅ What's Already Configured

1. **Supabase Client Setup**: Your backend already has the Supabase client configured in `backend/src/config/supabase.ts`
2. **Authentication Service**: Your auth service is already set up to use Supabase
3. **Database Operations**: All CRUD operations are configured for Supabase

### 🔄 Connection Flow

```
Frontend (Vercel) → Backend API (Vercel) → Supabase Database
```

1. **User registers/logs in** through your frontend
2. **Frontend sends request** to your Vercel backend API
3. **Backend processes request** using Supabase client
4. **Supabase handles** database operations
5. **Response sent back** through the chain

## 🧪 Testing Supabase Connection

### Test 1: Health Check
```bash
curl https://your-backend.vercel.app/api/health
```

### Test 2: Database Connection
```bash
curl https://your-backend.vercel.app/api/health/db
```

### Test 3: User Registration
```bash
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "company": "Test Company"
  }'
```

## 🔍 Troubleshooting Common Issues

### Issue 1: 405 Method Not Allowed
**Cause**: Missing environment variables or incorrect Vercel configuration
**Solution**: 
1. Verify all environment variables are set in Vercel
2. Check that `vercel.json` is properly configured
3. Redeploy your backend

### Issue 2: Supabase Connection Failed
**Cause**: Incorrect Supabase URL or keys
**Solution**:
1. Double-check your Supabase URL and keys
2. Ensure your Supabase project is active
3. Verify the keys have the correct permissions

### Issue 3: CORS Errors
**Cause**: Frontend and backend domains not properly configured
**Solution**:
1. Update `FRONTEND_URL` in backend environment variables
2. Ensure CORS is configured for your Vercel domains

## 🚀 Deployment Steps

### 1. Deploy Backend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod
```

### 2. Deploy Frontend to Vercel
```bash
# Deploy frontend
cd frontend
vercel --prod
```

### 3. Configure Environment Variables
- Add all required environment variables in Vercel dashboard
- Update frontend environment to point to backend URL

### 4. Test Connection
- Test health endpoints
- Test user registration
- Test user login
- Verify data is stored in Supabase

## ✅ Success Indicators

You'll know Supabase is connected successfully when:

1. **Health Check Passes**: `/api/health` returns success
2. **Database Health Passes**: `/api/health/db` returns success
3. **User Registration Works**: New users are created in Supabase
4. **User Login Works**: Existing users can authenticate
5. **Data Persists**: User data is stored and retrieved from Supabase

## 🔐 Security Considerations

### Environment Variables
- ✅ **SUPABASE_URL**: Safe to expose (public)
- ✅ **SUPABASE_ANON_KEY**: Safe to expose (public)
- ⚠️ **SUPABASE_SERVICE_ROLE_KEY**: Keep secret (server-side only)
- ⚠️ **JWT_SECRET**: Keep secret (server-side only)

### CORS Configuration
- Configure CORS to allow only your frontend domain
- Use environment variables for dynamic CORS configuration

## 🎉 Expected Results

Once properly configured, your Vercel deployment will:

1. **Connect to Supabase** automatically
2. **Handle authentication** seamlessly
3. **Store user data** in your Supabase database
4. **Work exactly like** your local development environment

Your Supabase connection will work perfectly on Vercel once you configure the environment variables correctly! 🚀
