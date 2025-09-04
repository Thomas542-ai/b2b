# 🚀 Supabase Setup Guide for LeadsFynder

## Quick Setup Steps

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Save your database password and API keys

### 2. Update Environment Variables
Add these to your `.env` file:

```bash
# Supabase Configuration
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

### 3. Install Supabase Dependencies
```bash
cd backend
npm install @supabase/supabase-js
```

### 4. Migrate Database
```bash
# Update DATABASE_URL to point to Supabase
npx prisma db push
npx prisma generate
```

### 5. Deploy to Vercel
- Connect your repo to Vercel
- Add environment variables in Vercel dashboard
- Deploy!

## Environment Variables for Vercel
Make sure to add these in your Vercel project settings:
- `DATABASE_URL`
- `SUPABASE_URL` 
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `NODE_ENV=production`

Your project will now use Supabase in production while keeping local PostgreSQL for development!
