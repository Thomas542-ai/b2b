-- =====================================================
-- Supabase Users Table Setup
-- =====================================================
-- This SQL file creates the users table with the exact structure
-- required by the LeadsFynder backend application

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with exact column structure
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_createdat ON users(createdat);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data security
-- Policy 1: Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Policy 2: Allow public registration (insert)
CREATE POLICY "Allow public registration" ON users
    FOR INSERT WITH CHECK (true);

-- Policy 3: Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy 4: Users can delete their own data
CREATE POLICY "Users can delete own data" ON users
    FOR DELETE USING (auth.uid()::text = id::text);

-- Insert sample admin user (optional)
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password, firstname, lastname, company, role) VALUES (
    'admin@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K',
    'Admin',
    'User',
    'Admin Company',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Create a function to automatically update createdat timestamp
CREATE OR REPLACE FUNCTION update_createdat_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.createdat = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically set createdat on insert
CREATE TRIGGER update_users_createdat 
    BEFORE INSERT ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_createdat_column();

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts for LeadsFynder application';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.password IS 'Hashed password using bcrypt';
COMMENT ON COLUMN users.firstname IS 'User first name';
COMMENT ON COLUMN users.lastname IS 'User last name';
COMMENT ON COLUMN users.company IS 'User company name (optional)';
COMMENT ON COLUMN users.phone IS 'User phone number (optional)';
COMMENT ON COLUMN users.role IS 'User role (USER, ADMIN)';
COMMENT ON COLUMN users.createdat IS 'Account creation timestamp';

-- Verify table creation
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Show table structure
\d users;
