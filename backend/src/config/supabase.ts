import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if we're using Supabase (production) or local PostgreSQL
const isUsingSupabase = !!supabaseUrl && !!supabaseAnonKey;

// Create Supabase client for client-side operations (if using Supabase)
export const supabaseClient = isUsingSupabase && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Create Supabase client for server-side operations (if using Supabase)
export const supabaseAdmin = isUsingSupabase && supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Helper function to check if we're using Supabase
export const isSupabaseEnvironment = () => isUsingSupabase;

// Helper function to get database connection info
export const getDatabaseInfo = () => {
  if (isUsingSupabase) {
    return {
      type: 'supabase',
      url: supabaseUrl,
      hasClient: !!supabaseClient,
      hasAdmin: !!supabaseAdmin
    };
  }
  
  return {
    type: 'local-postgresql',
    url: process.env.DATABASE_URL,
    hasClient: false,
    hasAdmin: false
  };
};

export default {
  supabaseClient,
  supabaseAdmin,
  isSupabaseEnvironment,
  getDatabaseInfo
};
