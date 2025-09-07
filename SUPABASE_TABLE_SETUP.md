# 🔧 Fix Local 500 Error - Supabase Table Setup

## 🚨 Problem Identified

The 500 Internal Server Error occurs because the Supabase `users` table doesn't exist or has the wrong structure.

## ✅ Solution: Create Users Table in Supabase

### **Step 1: Go to Supabase Dashboard**

1. **Open Supabase**: https://supabase.com/dashboard
2. **Select your project**: `fdylcrgqzgtmpehetmjq`
3. **Go to Table Editor**

### **Step 2: Create Users Table**

Click **"New Table"** and create a table with these columns:

| Column Name | Type | Default Value | Constraints |
|-------------|------|---------------|-------------|
| `id` | `uuid` | `gen_random_uuid()` | Primary Key |
| `email` | `text` | - | Unique, Not Null |
| `password` | `text` | - | Not Null |
| `firstname` | `text` | - | Not Null |
| `lastname` | `text` | - | Not Null |
| `company` | `text` | - | Nullable |
| `phone` | `text` | - | Nullable |
| `role` | `text` | `'USER'` | Not Null |
| `createdat` | `timestamptz` | `now()` | Not Null |

### **Step 3: SQL Command (Alternative)**

If you prefer SQL, run this in the SQL Editor:

```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'USER',
    createdat TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);
```

### **Step 4: Test Registration**

After creating the table, test registration:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "company": "Test Company",
    "phone": "+1234567890",
    "password": "test123"
  }'
```

## 🎯 Expected Result

After creating the table:

✅ **Registration works locally**
✅ **No more 500 errors**
✅ **Users stored in Supabase**
✅ **Login works with registered users**

## 🔍 Why This Happens

### **Root Cause:**
- Backend tries to insert into `users` table
- Table doesn't exist in Supabase
- Supabase returns error
- Backend throws 500 Internal Server Error

### **Solution:**
- Create the `users` table with correct structure
- Backend can now insert users successfully
- Registration works as expected

## 🚀 Quick Fix

1. **Create users table** in Supabase (2 minutes)
2. **Test registration** locally (1 minute)
3. **Verify login** works (1 minute)

**Total time**: ~4 minutes to fix the 500 error!

The table structure must match exactly what the backend expects:
- `firstname` (not `firstName`)
- `lastname` (not `lastName`) 
- `createdat` (not `createdAt`)
- `role` with default `'USER'`

Once the table is created, your local registration will work perfectly! 🎉
