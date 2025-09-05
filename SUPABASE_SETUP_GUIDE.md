# 🔧 Supabase Connection Setup Guide

## Current Issue
The Supabase project `qphomvhegulifftzirmb` appears to be either:
- Not accessible (project might be paused or deleted)
- Using incorrect connection credentials
- Network connectivity issues

## Solutions

### Option 1: Create a New Supabase Project (Recommended)

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Create a new project:**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `leadsfynder`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

3. **Get your connection details:**
   - Go to Settings → Database
   - Copy the connection string
   - Go to Settings → API
   - Copy your project URL and API keys

4. **Update your .env file:**
   ```bash
   cd backend
   # Replace with your actual Supabase details
   echo DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres > .env
   echo SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co >> .env
   echo SUPABASE_ANON_KEY=[YOUR_ANON_KEY] >> .env
   echo JWT_SECRET=leadsfynder_super_secure_jwt_secret_2025_production >> .env
   ```

5. **Test the connection:**
   ```bash
   npx prisma generate
   npx prisma db push
   node test-connection.js
   ```

### Option 2: Use Local PostgreSQL (For Development)

1. **Install PostgreSQL locally:**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Install with default settings
   - Remember the password you set for 'postgres' user

2. **Create the database:**
   ```sql
   CREATE DATABASE leadsfynder;
   ```

3. **Use local configuration:**
   ```bash
   cd backend
   cp .env.local .env
   # Edit .env and update the password if needed
   ```

4. **Test the connection:**
   ```bash
   npx prisma generate
   npx prisma db push
   node test-connection.js
   ```

### Option 3: Use Docker PostgreSQL (Quick Setup)

1. **Run PostgreSQL in Docker:**
   ```bash
   docker run --name leadsfynder-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=leadsfynder -p 5432:5432 -d postgres:15
   ```

2. **Use local configuration:**
   ```bash
   cd backend
   cp .env.local .env
   ```

3. **Test the connection:**
   ```bash
   npx prisma generate
   npx prisma db push
   node test-connection.js
   ```

## Verification Steps

After setting up your database:

1. **Test connection:**
   ```bash
   cd backend
   node test-connection.js
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Test the API:**
   - Visit: http://localhost:8000/api/health
   - Should return: `{"success":true,"message":"LeadsFynder API is healthy"}`

4. **Test database health:**
   - Visit: http://localhost:8000/api/health/db
   - Should return: `{"success":true,"message":"Database connection is healthy"}`

## Troubleshooting

### Common Issues:

1. **"Can't reach database server"**
   - Check if PostgreSQL is running
   - Verify connection string format
   - Check firewall settings

2. **"Authentication failed"**
   - Verify username and password
   - Check if user has proper permissions

3. **"Database does not exist"**
   - Create the database manually
   - Run `npx prisma db push` to create tables

### Getting Help:

- Check Supabase status: [status.supabase.com](https://status.supabase.com)
- Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Prisma documentation: [prisma.io/docs](https://prisma.io/docs)

## Next Steps

Once your database is connected:

1. **Start the backend:** `npm run dev`
2. **Start the frontend:** `cd ../frontend && npm run dev`
3. **Access your app:** http://localhost:3000

Your LeadsFynder application will be fully functional with database connectivity!
