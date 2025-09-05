import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration - Required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client for client-side operations
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Create Supabase client for server-side operations (with service role key)
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(
      supabaseUrl!,
      supabaseServiceRoleKey || supabaseAnonKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

// Database connection helper
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  }
  return supabase;
};

// Admin client for server-side operations
export const getSupabaseAdmin = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  }
  return supabaseAdmin;
};

// Helper function to get database connection info
export const getDatabaseInfo = () => {
  return {
    type: 'supabase',
    url: supabaseUrl,
    hasClient: !!supabase,
    hasAdmin: !!supabaseAdmin
  };
};

export default supabase;
