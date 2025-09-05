# LeadsFynder - B2B Lead Generation SaaS

A production-ready B2B lead generation and outreach platform built with React, Node.js, and Supabase.

## 🚀 Quick Setup

### 1. Local Development Setup

#### Backend Setup:
1. **Setup backend environment:**
   ```bash
   cd backend
   node setup-env.js
   ```
   This will prompt you for your Supabase database password and create a `.env` file.

2. **Install dependencies and setup database:**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   ```

3. **Test the database connection:**
   ```bash
   node test-connection.js
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

#### Frontend Setup:
1. **Setup frontend environment:**
   ```bash
   cd frontend
   node setup-env.js
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

#### Access Your Application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/api/health

### 2. Database Setup
**⚠️ Important:** The original Supabase project may not be accessible. Please follow the setup guide:

📖 **See [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for detailed instructions**

**Quick Options:**
- **Option A:** Create a new Supabase project (recommended for production)
- **Option B:** Use local PostgreSQL (for development)
- **Option C:** Use Docker PostgreSQL (quick setup)

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" and import this repository
3. Add these environment variables:

```
DATABASE_URL=postgresql://postgres.qphomvhegulifftzirmb:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://qphomvhegulifftzirmb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaG9tdmhlZ3VsaWZmdHppcm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjgxNzksImV4cCI6MjA3MjUwNDE3OX0.W74O4Z-Q-7SXH6x7bq2wghRlae28tZ2qb4VQzz398e4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaG9tdmhlZ3VsaWZmdHppcm1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjkyODE3OSwiZXhwIjoyMDcyNTA0MTc5fQ.QS8cVpE-hiScjOcrOIh9WeV62EE5iukMDYBdqcNq-zE
JWT_SECRET=leadsfynder_super_secure_jwt_secret_2025_production
NODE_ENV=production
```

4. Deploy!

### 4. Run Database Migrations
After deployment, run:
```bash
cd backend
npx prisma migrate deploy
```

## ✅ Features

- **Authentication**: JWT-based user registration/login
- **Lead Management**: Full CRM functionality
- **Email Campaigns**: Bulk email outreach
- **File Uploads**: Supabase Storage integration
- **Payment Integration**: Stripe, PayPal, Razorpay
- **Real-time Database**: Supabase PostgreSQL
- **Serverless**: Vercel Functions backend

## 🛠 Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Storage**: Supabase Storage
- **Deployment**: Vercel (Frontend + Backend)

## 📁 Project Structure

```
├── frontend/          # React frontend
├── backend/           # Node.js API
├── api/              # Vercel serverless entry point
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## 🎯 Ready to Launch!

Your B2B SaaS platform is production-ready and optimized for Vercel deployment.