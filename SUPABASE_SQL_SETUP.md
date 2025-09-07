# 🗄️ Supabase SQL Setup Guide

## 📁 SQL Files Available

### **1. `supabase_users_table.sql` (Complete Version)**
- ✅ **Full table setup** with all features
- ✅ **Indexes** for better performance
- ✅ **Row Level Security** policies
- ✅ **Triggers** for automatic timestamps
- ✅ **Sample admin user**
- ✅ **Documentation** and comments

### **2. `supabase_users_simple.sql` (Quick Version)**
- ✅ **Basic table setup** for quick deployment
- ✅ **Essential RLS policies**
- ✅ **Sample admin user**
- ✅ **Minimal configuration**

## 🚀 How to Use

### **Option 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `fdylcrgqzgtmpehetmjq`
3. **Go to SQL Editor**
4. **Copy and paste** the SQL code from either file
5. **Click "Run"** to execute

### **Option 2: Command Line**

```bash
# Using psql (if you have PostgreSQL client)
psql "postgresql://postgres:[YOUR-PASSWORD]@db.fdylcrgqzgtmpehetmjq.supabase.co:5432/postgres" -f supabase_users_table.sql
```

## 🎯 Which File to Use?

### **Use `supabase_users_simple.sql` if:**
- ✅ You want **quick setup**
- ✅ You're **testing locally**
- ✅ You need **basic functionality**

### **Use `supabase_users_table.sql` if:**
- ✅ You want **production-ready setup**
- ✅ You need **better performance**
- ✅ You want **advanced features**
- ✅ You're **deploying to production**

## 📋 Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | `UUID` | Primary key, auto-generated |
| `email` | `TEXT` | User email (unique) |
| `password` | `TEXT` | Hashed password |
| `firstname` | `TEXT` | User first name |
| `lastname` | `TEXT` | User last name |
| `company` | `TEXT` | Company name (optional) |
| `phone` | `TEXT` | Phone number (optional) |
| `role` | `TEXT` | User role (USER/ADMIN) |
| `createdat` | `TIMESTAMPTZ` | Creation timestamp |

## 🔐 Security Features

### **Row Level Security (RLS)**
- ✅ **Users can only see their own data**
- ✅ **Public registration allowed**
- ✅ **Secure data access**

### **Sample Admin User**
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

## 🧪 Test After Setup

### **1. Test Registration**
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

### **2. Test Login**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## ✅ Expected Results

After running the SQL:

✅ **No more 500 errors**
✅ **Registration works locally**
✅ **Users stored in Supabase**
✅ **Login works with registered users**
✅ **Admin user available for testing**

## 🚨 Important Notes

### **Field Names Must Match**
- Backend expects: `firstname`, `lastname`, `createdat`
- **NOT**: `firstName`, `lastName`, `createdAt`

### **Password Hashing**
- Passwords are hashed with bcrypt
- Sample admin password: `admin123` (already hashed)

### **Role System**
- Default role: `USER`
- Admin role: `ADMIN`
- Used for authorization

## 🎉 Quick Start

1. **Copy** `supabase_users_simple.sql`
2. **Paste** in Supabase SQL Editor
3. **Run** the SQL
4. **Test** registration locally
5. **Enjoy** working authentication! 🚀

Your local 500 error will be fixed immediately after running this SQL! 🎯
