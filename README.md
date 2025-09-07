# 🚀 LeadsFynder - Lead Generation & Email Marketing Platform

A comprehensive B2B lead generation and email marketing platform built with React and Supabase.

## ✨ Features

- **Lead Management**: Collect, track, and manage leads
- **Email Marketing**: Create and manage email campaigns
- **User Authentication**: Secure login/registration
- **Analytics Dashboard**: Track performance and metrics

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT tokens

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/leadsfynder.git
cd leadsfynder
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create `frontend/.env.local` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=LeadsFynder
VITE_APP_VERSION=1.0.0
```

### 4. Run Development Server
```bash
npm run dev
```

## 🚀 Deploy to Vercel

### 1. Add Environment Variables to Vercel
```env
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZdeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo
JWT_SECRET=Frj6qu8lE6/KbmFGyasbvFlaF9Jw1TgLShxwdrJDgchFG0g39Xf5Pd/FTxh7gxgAv17l8zBFdWzQvHtUtMnBlg==
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### 2. Configure Vercel Project
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Root Directory**: Leave empty

### 3. Deploy
Push to GitHub and Vercel will automatically deploy.

## 📚 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Row Level Security in Supabase
- CORS configuration

---

**Made with ❤️ by the LeadsFynder Team**