# Vercel Deployment Guide for LeadsFynder

## The Problem
When deploying to Vercel, your frontend tries to connect to `localhost:8000` which doesn't exist in the Vercel environment, causing `ERR_CONNECTION_REFUSED` errors.

## Solution

### Step 1: Update API Configuration ✅
The API configuration has been updated to use environment variables:
- `frontend/src/config/api.ts` now uses `import.meta.env.VITE_API_URL`
- `frontend/src/services/auth.ts` already uses the environment variable

### Step 2: Set Up Your Backend
You need to deploy your backend somewhere accessible. Options:

#### Option A: Deploy Backend to Vercel (Recommended)
1. Create a separate Vercel project for your backend
2. Deploy the backend folder to Vercel
3. Get the backend URL (e.g., `https://your-backend.vercel.app`)

#### Option B: Use Railway, Render, or Heroku
1. Deploy your backend to any hosting service
2. Get the production URL

#### Option C: Use Supabase + Vercel Functions
1. Create Vercel functions for your API endpoints
2. Use Supabase for database

### Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
VITE_API_URL = https://your-backend-domain.com/api
VITE_APP_NAME = LeadsFynder
```

### Step 4: Update Vercel Configuration

Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

### Step 5: Update Frontend Build Configuration

Make sure your `frontend/package.json` has the correct build script:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 6: Deploy

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy your frontend

## Quick Fix for Testing

If you want to test quickly, you can temporarily update the API URL in your code:

1. Find where your backend is deployed (e.g., Railway, Render, etc.)
2. Update the `VITE_API_URL` environment variable in Vercel
3. Redeploy

## Environment Variables Reference

### Frontend (.env.local for local development)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=LeadsFynder
```

### Production (Vercel Environment Variables)
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=LeadsFynder
```

## Troubleshooting

### Still getting connection errors?
1. Check that your backend is actually deployed and accessible
2. Verify the `VITE_API_URL` environment variable is set correctly in Vercel
3. Make sure your backend CORS settings allow requests from your Vercel domain
4. Check the browser network tab to see the actual URL being called

### CORS Issues?
Update your backend CORS configuration to include your Vercel domain:

```javascript
// In your backend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}
```

## Next Steps

1. **Deploy your backend** to a hosting service
2. **Set the environment variables** in Vercel
3. **Redeploy your frontend** to Vercel
4. **Test the connection** by trying to log in

The frontend code is now properly configured to use environment variables, so once you set the correct `VITE_API_URL` in Vercel, the connection errors should be resolved!
