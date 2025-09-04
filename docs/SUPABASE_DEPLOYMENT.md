# 🚀 Supabase Migration & Vercel Deployment Guide

This guide will help you migrate your LeadsFynder project from local PostgreSQL to Supabase and deploy it to Vercel.

## 📋 Prerequisites

- [Supabase Account](https://supabase.com) (free tier available)
- [Vercel Account](https://vercel.com) (free tier available)
- Node.js and npm installed
- Your project running locally with PostgreSQL

## 🔧 Step 1: Set up Supabase Project

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `leadsfynder`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Get Connection Details
1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (`SUPABASE_URL`)
   - **Anon public** (`SUPABASE_ANON_KEY`)
   - **Service role** (`SUPABASE_SERVICE_ROLE_KEY`)

## 🔐 Step 2: Update Environment Variables

### 2.1 Create Production Environment File
Create a `.env.production` file in your backend directory:

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Other production settings
NODE_ENV=production
JWT_SECRET=[YOUR-PRODUCTION-JWT-SECRET]
# ... other production variables
```

### 2.2 Update Local Environment
In your local `.env` file, comment out the local DATABASE_URL and uncomment the Supabase one when ready to test.

## 🗄️ Step 3: Migrate Database Schema

### 3.1 Install Dependencies
```bash
cd backend
npm install
```

### 3.2 Run Migration Script
```bash
npm run migrate:supabase
# or manually:
npx ts-node scripts/migrate-to-supabase.ts
```

### 3.3 Verify Migration
1. Go to Supabase Dashboard → **Table Editor**
2. Verify all tables are created:
   - `users`
   - `subscriptions`
   - `plans`
   - `leads`
   - `email_campaigns`
   - `call_logs`
   - `follow_ups`

## 🧪 Step 4: Test with Supabase

### 4.1 Test Database Connection
```bash
cd backend
npm run dev
```

### 4.2 Test API Endpoints
- Test user registration: `POST /api/auth/register`
- Test user login: `POST /api/auth/login`
- Test lead creation: `POST /api/leads`

### 4.3 Check Supabase Logs
- Go to Supabase Dashboard → **Logs**
- Verify API calls are being logged

## 🚀 Step 5: Deploy to Vercel

### 5.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub/GitLab repository
4. Configure project settings

### 5.2 Set Environment Variables
In Vercel project settings, add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Production settings
NODE_ENV=production
JWT_SECRET=[YOUR-PRODUCTION-JWT-SECRET]
FRONTEND_URL=https://your-domain.vercel.app
CORS_ORIGIN=https://your-domain.vercel.app
```

### 5.3 Deploy
1. Push your changes to your repository
2. Vercel will automatically build and deploy
3. Check deployment logs for any errors

## 🔍 Step 6: Post-Deployment Verification

### 6.1 Test Production API
```bash
# Test your deployed API
curl https://your-domain.vercel.app/api/health
```

### 6.2 Monitor Supabase
- Check Supabase Dashboard → **Logs**
- Monitor database performance
- Check for any connection issues

### 6.3 Test Full User Flow
1. User registration
2. User login
3. Lead creation
4. Email campaigns
5. Call logs

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Verify `DATABASE_URL` format
- Check Supabase project status
- Verify database password

#### 2. CORS Errors
- Update `CORS_ORIGIN` in Vercel environment variables
- Ensure frontend URL matches exactly

#### 3. Prisma Client Issues
- Run `npx prisma generate` after schema changes
- Clear Vercel build cache

#### 4. Environment Variables Not Loading
- Verify variable names in Vercel
- Check for typos
- Redeploy after adding variables

### Debug Commands
```bash
# Check database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# View database schema
npx prisma studio

# Reset database (careful!)
npx prisma db push --force-reset
```

## 📊 Monitoring & Maintenance

### 1. Supabase Dashboard
- Monitor database performance
- Check API usage
- Review logs for errors

### 2. Vercel Analytics
- Monitor API response times
- Check for deployment errors
- Track user performance

### 3. Regular Maintenance
- Keep dependencies updated
- Monitor database size
- Review API usage patterns

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable encryption
- Rotate secrets regularly

### 2. Database Security
- Use connection pooling (Supabase handles this)
- Implement proper authentication
- Regular security audits

### 3. API Security
- Rate limiting
- Input validation
- JWT token management

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/)

## 🎯 Next Steps

After successful deployment:

1. **Set up custom domain** in Vercel
2. **Configure SSL certificates**
3. **Set up monitoring** (Sentry, New Relic)
4. **Implement CI/CD** pipeline
5. **Set up staging environment**

---

**Need help?** Check the troubleshooting section or create an issue in your repository.
