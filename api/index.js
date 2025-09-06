import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to set CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

// Login handler
async function handleLogin(req, res) {
  try {
    console.log('Login handler called with body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password:', { email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('Login attempt:', { email });

    // Authenticate user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Login auth result:', { authData: authData?.user?.email, authError });

    if (authError || !authData.user) {
      console.error('Login failed:', authError);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: authError?.message
      });
    }

    // Get user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    console.log('User profile retrieval:', { userProfile, profileError });

    if (profileError || !userProfile) {
      console.error('Failed to retrieve user profile:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile',
        error: profileError?.message
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { userId: userProfile.id, email: userProfile.email, role: userProfile.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userProfile,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
}

// Register handler
async function handleRegister(req, res) {
  try {
    console.log('Register handler called with body:', req.body);
    const { firstName, lastName, email, password, company, phone } = req.body;
    console.log('Registration attempt:', { email, firstName, lastName });

    if (!firstName || !lastName || !email || !password || !company || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('Supabase admin client obtained');

    // Check if user already exists in Supabase Auth
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    
    console.log('Existing users check:', { userCount: existingUser?.users?.length, checkError });
    const userExists = existingUser?.users?.some((user) => user.email === email);
    
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    console.log('Auth user creation:', { authData, authError });

    if (authError || !authData.user) {
      console.error('Failed to create auth user:', authError);
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account',
        error: authError?.message
      });
    }

    // Create user profile in users table
    let newUser, profileError;
    
    // First try camelCase
    const camelCaseResult = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        firstName,
        lastName,
        email,
        company,
        phone,
        isEmailVerified: true,
        isActive: true,
        role: 'USER'
      })
      .select()
      .single();
    
    if (camelCaseResult.error) {
      // If camelCase fails, try snake_case
      const snakeCaseResult = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          company,
          phone,
          is_email_verified: true,
          is_active: true,
          role: 'USER'
        })
        .select()
        .single();
      
      newUser = snakeCaseResult.data;
      profileError = snakeCaseResult.error;
    } else {
      newUser = camelCaseResult.data;
      profileError = camelCaseResult.error;
    }

    console.log('Profile creation result:', { newUser, profileError });

    if (profileError || !newUser) {
      console.error('Profile creation failed:', profileError);
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
        console.log('Cleaned up auth user after profile creation failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create user profile',
        error: profileError?.message || 'Unknown error'
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
}

// Health check handler
async function handleHealth(req, res) {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'LeadsFynder API is healthy and connected to Supabase',
      timestamp: new Date().toISOString(),
      databaseConnected: true
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      success: false,
      message: 'API is unhealthy or database connection failed',
      error: error.message
    });
  }
}

// Main handler
export default async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from the request
  const path = req.url || req.path || '';
  console.log('Request details:', { method: req.method, url: req.url, path: req.path });

  try {
    // Route to different handlers based on path
    if (path.includes('/auth/login') && req.method === 'POST') {
      return await handleLogin(req, res);
    } else if (path.includes('/auth/register') && req.method === 'POST') {
      return await handleRegister(req, res);
    } else if (path.includes('/health') && req.method === 'GET') {
      return await handleHealth(req, res);
    } else {
      return res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: path,
        method: req.method
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
