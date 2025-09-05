# LeadsFynder Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd leadsfynder

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

### 2. Set up Supabase

```bash
# 1. Create a new project at https://supabase.com
# 2. Go to Settings > Database
# 3. Copy your database URL and API keys
# 4. Update your .env file with these credentials
```

### 3. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 4. Database Setup

```bash
# Run migrations to create tables
cd backend
npx prisma db push

# Seed demo data (optional)
npm run seed
```

### 5. Start the Application

```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/api/health

## Manual Setup (Development)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Seed data
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Configuration

### Required Environment Variables

```env
# Database - Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEVERBOUNCE_API_KEY=your-neverbounce-api-key
DEBOUNCE_API_KEY=your-debounce-api-key
```

## Production Deployment

### 1. Build for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### 2. Set Production Environment

```bash
# Create production .env file
cp env.example .env.prod
# Edit with production values
```

### 3. Deploy to Hosting Platform

Deploy to services like:
- **Backend**: Vercel, Railway, Heroku, or DigitalOcean
- **Frontend**: Vercel, Netlify, or similar

### 4. Run Migrations

```bash
cd backend
npx prisma db push
```

## Database Migration (From Other Systems)

### From Local PostgreSQL to Supabase

1. **Export your data** (if you have existing data):
   ```bash
   pg_dump -h localhost -U username -d leadsfynder > backup.sql
   ```

2. **Import to Supabase**:
   - Use the Supabase dashboard SQL editor
   - Or use the Supabase CLI

### From Other Databases

Use Supabase's migration tools or export/import functionality in the Supabase dashboard.

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **Port Already in Use**
   - Change ports in docker-compose.yml
   - Kill existing processes

3. **Permission Denied**
   - Check file permissions
   - Run with sudo if needed

4. **Build Failures**
   - Clear Docker cache: `docker system prune`
   - Rebuild images: `docker-compose build --no-cache`

### Logs

```bash
# Backend logs (if using PM2)
pm2 logs

# Or check console output when running:
# Backend: npm run dev
# Frontend: npm run dev
```

## Support

For additional help:
- Check the [README.md](../README.md)
- Review [API Documentation](../docs/api-reference.md)
- Open an issue on GitHub
