import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, checkConnectionHealth, getDatabaseInfo } from '../src/config/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const startTime = Date.now();
    
    // Get database info
    const dbInfo = getDatabaseInfo();
    
    // Test connection health
    let connectionHealthy = false;
    let connectionError = null;
    
    try {
      const supabase = await getSupabaseAdmin();
      connectionHealthy = await checkConnectionHealth(supabase, 10000); // 10 second timeout
    } catch (error) {
      connectionError = error.message;
    }
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      success: true,
      message: 'Connection test completed',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        ...dbInfo,
        connectionHealthy,
        connectionError
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });

  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
