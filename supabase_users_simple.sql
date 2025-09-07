-- =====================================================
-- Simple Users Table Setup (Quick Version)
-- =====================================================
-- Use this for quick setup without advanced features

-- Create users table
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

-- Allow public registration
CREATE POLICY "Allow public registration" ON users
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Insert sample admin user
INSERT INTO users (email, password, firstname, lastname, company, role) VALUES (
    'admin@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K',
    'Admin',
    'User',
    'Admin Company',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;
