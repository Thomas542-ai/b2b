# Vercel Deployment Guide

## Prerequisites
- Vercel account
- Supabase project with database set up

## Environment Variables
Set these in your Vercel project settings:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

## Deployment Steps

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Or use Vercel CLI: `vercel --prod`

2. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all the variables listed above

3. **Deploy**
   - Vercel will automatically build and deploy
   - Frontend will be built from `frontend/` directory
   - API functions will be deployed from `api/` directory

## API Endpoints
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/health` - Health check

## Local Development
```bash
# Install dependencies
npm install

# Start development servers
npm run dev
```

## Project Structure
```
project/
├── api/           # Vercel serverless functions
├── frontend/      # React frontend
├── backend/       # Local development backend
├── vercel.json    # Vercel configuration
└── package.json   # Root dependencies
```
