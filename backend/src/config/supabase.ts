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

// Connection options with timeout and retry settings
const connectionOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'leadsfynder-backend'
    }
  }
};
                                                             
// Create Supabase client for client-side operations
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!, connectionOptions)
  : null;

// Create Supabase client for server-side operations (with service role key)
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(
      supabaseUrl!,
      supabaseServiceRoleKey || supabaseAnonKey!,
      connectionOptions
    )
  : null;

// Connection health check with timeout
export const checkConnectionHealth = async (client: any, timeoutMs: number = 5000): Promise<boolean> => {
  if (!client) return false;
  
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), timeoutMs)
    );
    
    const healthCheck = client.from('users').select('count').limit(1);
    
    await Promise.race([healthCheck, timeoutPromise]);
    return true;
  } catch (error) {
    console.error('Connection health check failed:', error);
    return false;
  }
};

// Database connection helper with retry logic
export const getSupabaseClient = async (retries: number = 3): Promise<any> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  }
  
  for (let i = 0; i < retries; i++) {
    const isHealthy = await checkConnectionHealth(supabase);
    if (isHealthy) {
      return supabase;
    }
    
    if (i < retries - 1) {
      console.log(`Connection attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Failed to establish database connection after multiple attempts');
};

// Admin client for server-side operations with retry logic
export const getSupabaseAdmin = async (retries: number = 3): Promise<any> => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  }
  
  for (let i = 0; i < retries; i++) {
    const isHealthy = await checkConnectionHealth(supabaseAdmin);
    if (isHealthy) {
      return supabaseAdmin;
    }
    
    if (i < retries - 1) {
      console.log(`Admin connection attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Failed to establish admin database connection after multiple attempts');
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
