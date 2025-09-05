# Supabase Setup Guide for LeadsFynder

This guide will help you set up Supabase as your database for the LeadsFynder project.

## 🚀 Step 1: Create a Supabase Project

1. **Go to Supabase**: Visit [https://supabase.com](https://supabase.com)
2. **Sign up/Login**: Create an account or log in
3. **Create New Project**: Click "New Project"
4. **Fill in Details**:
   - **Name**: `leadsfynder` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Start with the free tier

## 🔑 Step 2: Get Your Database Credentials

1. **Go to Settings**: In your project dashboard, click "Settings" (gear icon)
2. **Database Tab**: Click on "Database" in the left sidebar
3. **Copy Connection String**: 
   - Scroll down to "Connection string"
   - Select "URI" format
   - Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

4. **Get API Keys**:
   - Go to "API" tab in Settings
   - Copy the following:
     - **Project URL**: `https://[PROJECT-REF].supabase.co`
     - **anon public key**: `eyJ...` (starts with eyJ)
     - **service_role secret key**: `eyJ...` (starts with eyJ)

## ⚙️ Step 3: Update Your Environment Variables

1. **Open your `.env` file** in the project root
2. **Replace the database section** with your Supabase credentials:

```env
# Database - Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace the following placeholders**:
- `[YOUR-PASSWORD]` - Your database password from Step 1
- `[PROJECT-REF]` - Your project reference (found in the URL)
- The API keys with your actual keys from Step 2

## 🗄️ Step 4: Set Up Database Schema

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Push the schema to Supabase**:
   ```bash
   npx prisma db push
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

## ✅ Step 5: Verify the Setup

1. **Start your backend server**:
   ```bash
   npm run dev
   ```

2. **Test the connection**:
   ```bash
   curl http://localhost:8000/api/health/db
   curl http://localhost:8000/api/health/supabase
   ```

3. **Check Supabase Dashboard**:
   - Go to your Supabase project
   - Click "Table Editor" in the left sidebar
   - You should see all your tables created (users, leads, etc.)

## 🔧 Step 6: Optional - Seed Demo Data

If you want to add some sample data:

```bash
cd backend
npm run seed
```

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Failed**:
   - Double-check your `DATABASE_URL` format
   - Ensure your password doesn't contain special characters that need URL encoding
   - Verify your project is not paused (free tier has limits)

2. **Schema Push Failed**:
   - Make sure you're in the `backend` directory
   - Check that your `.env` file is in the project root
   - Verify your Supabase project is active

3. **API Key Issues**:
   - Ensure you're using the correct keys (anon vs service_role)
   - Check that the keys are copied completely (they're very long)

### Getting Help:

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Prisma Docs**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Project Issues**: Check the GitHub issues for this project

## 🎉 You're All Set!

Your LeadsFynder project is now connected to Supabase! You can:

- View your data in the Supabase dashboard
- Use the Supabase client for real-time features
- Scale your database as needed
- Use Supabase's built-in authentication (optional)

## 🔄 Migration from Local PostgreSQL

If you were previously using a local PostgreSQL database:

1. **Export your data** (if needed):
   ```bash
   pg_dump -h localhost -U postgres -d leadsfynder > backup.sql
   ```

2. **Import to Supabase** (if needed):
   - Use the Supabase dashboard SQL editor
   - Or use the Supabase CLI

3. **Update your application** to use the new Supabase connection

---

**Next Steps**: Continue with the main setup guide to start your application!
