<<<<<<< HEAD
# Supabase Setup Guide for LeadsFynder

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Note down your project credentials

## Step 1: Get Your Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** (URI format)
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

## Step 2: Update Environment Variables

1. Copy the existing `.env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and update the `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

   Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual Supabase credentials.

## Step 3: Run Prisma Migrations

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Run migrations against Supabase:
   ```bash
   npx prisma migrate deploy
   ```

## Step 4: Verify Connection

1. Test the database connection:
   ```bash
   npx prisma db pull
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

3. Check the health endpoint:
   ```bash
   curl http://localhost:8000/api/health/db
   ```

## Step 5: Update Docker Configuration (Optional)

If you want to use Supabase with Docker, update `docker-compose.yml`:

```yaml
backend:
  environment:
    DATABASE_URL: ${DATABASE_URL}  # This will use your .env file
    # Remove the local postgres dependency
```

And remove or comment out the postgres service since you're using Supabase.

## Troubleshooting

### Connection Issues
- Verify your Supabase connection string is correct
- Check that your IP is whitelisted in Supabase (if using IP restrictions)
- Ensure your Supabase project is active

### Migration Issues
- Make sure you have the latest Prisma version: `npm update @prisma/client prisma`
- If migrations fail, you can reset: `npx prisma migrate reset`

### Environment Variables
- Ensure your `.env` file is in the project root
- Check that `DATABASE_URL` is properly formatted
- Verify no extra spaces or quotes in the connection string

## Next Steps

Once connected to Supabase:
1. Your database will be hosted on Supabase's infrastructure
2. You can use Supabase's built-in features like:
   - Real-time subscriptions
   - Row Level Security (RLS)
   - Built-in authentication (if you want to migrate from JWT)
   - Storage for file uploads
   - Edge functions

## Security Notes

- Never commit your `.env` file to version control
- Use environment-specific connection strings for different environments
- Consider using Supabase's Row Level Security for additional data protection
=======
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
>>>>>>> 5137a171bd657402ee3002fc346d2938965adf9f
