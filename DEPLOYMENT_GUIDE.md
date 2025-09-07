# LeadsFynder Deployment Guide

## 🚀 Quick Deployment Steps

Your LeadsFynder application is now ready for deployment! Here's how to deploy it online:

### Prerequisites
- GitHub account (free)
- Railway account (free tier available)
- Netlify account (free tier available)

## Step 1: Deploy Backend to Railway

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub and push
git remote add origin https://github.com/yourusername/leadsfynder.git
git push -u origin main
```

### 1.2 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your LeadsFynder repository
5. Railway will automatically detect it's a Node.js project

### 1.3 Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
NODE_ENV=production
PORT=8000
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo
JWT_SECRET=Frj6qu8lE6/KbmFGyasbvFlaF9Jw1TgLShxwdrJDgchFG0g39Xf5Pd/FTxh7gxgAv17l8zBFdWzQvHtUtMnBlg==
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### 1.4 Update Railway Configuration
Railway will automatically use the `railway.json` file we created. The backend will be available at: `https://your-project-name.railway.app`

## Step 2: Deploy Frontend to Netlify

### 2.1 Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git" → "GitHub"
4. Select your LeadsFynder repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 2.2 Configure Environment Variables
In Netlify dashboard, go to Site settings → Environment variables and add:

```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_APP_NAME=LeadsFynder
VITE_APP_VERSION=1.0.0
```

### 2.3 Update Backend CORS
After getting your Netlify URL, update the `FRONTEND_URL` in Railway:
```
FRONTEND_URL=https://your-site-name.netlify.app
```

## Step 3: Test Your Deployment

### 3.1 Test Backend
Visit: `https://your-backend-url.railway.app/api/health`
You should see: `{"status":"ok","timestamp":"..."}`

### 3.2 Test Frontend
Visit: `https://your-site-name.netlify.app`
You should see your LeadsFynder login page.

### 3.3 Test Authentication
1. Try registering a new account
2. Try logging in
3. Check if the dashboard loads

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure `FRONTEND_URL` in Railway matches your Netlify URL exactly
   - Check that the URL doesn't have trailing slashes

2. **Build Failures**
   - Check Railway logs for build errors
   - Ensure all environment variables are set

3. **Database Connection Issues**
   - Verify Supabase credentials are correct
   - Check if your Supabase project is active

4. **Frontend Not Loading**
   - Check Netlify build logs
   - Verify environment variables are set correctly

### Useful Commands

```bash
# Check Railway logs
railway logs

# Redeploy backend
railway up

# Check Netlify build status
# Go to Netlify dashboard → Deploys
```

## 📱 Access Your Application

Once deployed, your LeadsFynder application will be available at:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend API**: `https://your-backend-url.railway.app/api`
- **Health Check**: `https://your-backend-url.railway.app/api/health`

## 🎉 Success!

Your LeadsFynder application is now live and accessible from anywhere in the world! You can:
- Register and login from any device
- Access your dashboard remotely
- Share the URL with team members
- Use it for your lead generation business

## 🔄 Updates

To update your application:
1. Make changes to your code
2. Push to GitHub
3. Railway and Netlify will automatically redeploy

## 💰 Cost

- **Railway**: Free tier includes 500 hours/month
- **Netlify**: Free tier includes 100GB bandwidth/month
- **Supabase**: Free tier includes 500MB database storage

All services offer generous free tiers perfect for getting started!
