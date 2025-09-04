# 🚀 Deployment Guide - GitHub to Vercel

## Quick Deployment Steps

### 1. Upload to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: LeadsFynder project with Supabase integration"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/leadsfynder.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd backend && npm run build`
   - **Output Directory**: `backend/dist`
   - **Install Command**: `cd backend && npm install`

3. **Add Environment Variables**
   In Vercel project settings, add these variables:

   ```bash
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres.qphomvhegulifftzirmb:YOUR_DB_PASSWORD@aws-0-[REGION].pooler.supabase.com:6543/postgres
   SUPABASE_URL=https://qphomvhegulifftzirmb.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaG9tdmhlZ3VsaWZmdHppcm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjgxNzksImV4cCI6MjA3MjUwNDE3OX0.W74O4Z-Q-7SXH6x7bq2wghRlae28tZ2qb4VQzz398e4
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaG9tdmhlZ3VsaWZmdHppcm1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODE3OSwiZXhwIjoyMDcyNTA0MTc5fQ.QS8cVpE-hiScjOcrOIh9WeV62EE5iukMDYBdqcNq-zE
   
   # Production Settings
   NODE_ENV=production
   JWT_SECRET=your-production-jwt-secret-key
   FRONTEND_URL=https://your-project.vercel.app
   CORS_ORIGIN=https://your-project.vercel.app
   PORT=8000
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### 3. Post-Deployment Setup

1. **Run Database Migration**
   ```bash
   # Connect to your Vercel deployment
   vercel env pull .env.local
   
   # Run migration
   npx prisma db push
   ```

2. **Test Your Application**
   - Visit your Vercel URL
   - Test user registration
   - Test lead creation
   - Verify database connection

### 4. Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**
   - Update `FRONTEND_URL` and `CORS_ORIGIN` with your custom domain

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **Database Connection Error**
   - Verify DATABASE_URL format
   - Check Supabase project status
   - Ensure database password is correct

3. **Environment Variables Not Loading**
   - Verify variable names in Vercel
   - Check for typos
   - Redeploy after adding variables

### Debug Commands

```bash
# Check Vercel deployment logs
vercel logs

# Test database connection locally
npx prisma db pull

# Generate Prisma client
npx prisma generate
```

## 📊 Monitoring

- **Vercel Analytics**: Monitor performance and usage
- **Supabase Dashboard**: Monitor database and API usage
- **Application Logs**: Check Vercel function logs

Your LeadsFynder application is now live and ready to show to clients! 🎉
