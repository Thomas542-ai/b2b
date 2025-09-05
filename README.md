# LeadsFynder

A lead generation and email marketing platform.

## Quick Start

### 1. Get Supabase Database
- Go to [supabase.com](https://supabase.com) (free)
- Create project: "leadsfynder"
- Copy the PostgreSQL connection string from Settings > Database
- Copy the Supabase URL and API keys from Settings > API

### 2. Update Environment
Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=leadsfynder_super_secure_jwt_secret_2025_production
```

### 3. Run Project
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel login
cd backend && vercel --prod
cd frontend && vercel --prod
```

## Tech Stack
- Backend: Node.js, Express, Prisma, Supabase (PostgreSQL)
- Frontend: React, TypeScript, Vite, Tailwind CSS