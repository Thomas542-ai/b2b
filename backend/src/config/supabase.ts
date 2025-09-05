import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration - Required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required Supabase environment variables
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing required Supabase environment variables. Please check SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.');
}

// Create Supabase client for client-side operations
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase client for server-side operations with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper function to get database connection info
export const getDatabaseInfo = () => {
  return {
    type: 'supabase',
    url: supabaseUrl,
    hasClient: true,
    hasAdmin: true
  };
};

export default {
  supabaseClient,
  supabaseAdmin,
  getDatabaseInfo
};
