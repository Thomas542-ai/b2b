const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  console.log('='.repeat(80));
  console.log('🚀 LOGIN FUNCTION STARTED');
  console.log('='.repeat(80));
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🔍 Request Details:');
  console.log('   Method:', req.method);
  console.log('   URL:', req.url);
  console.log('   Headers:', JSON.stringify(req.headers, null, 2));
  console.log('   Body:', JSON.stringify(req.body, null, 2));
  console.log('   Query:', JSON.stringify(req.query, null, 2));
  console.log('='.repeat(80));

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ STEP 1: Handling OPTIONS preflight request');
    console.log('📤 Sending 200 response for OPTIONS');
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ STEP 1: Method not allowed:', req.method);
    console.log('📤 Sending 405 response - Method not allowed');
    const errorResponse = { 
      success: false, 
      message: 'Method not allowed. Only POST requests are accepted.',
      receivedMethod: req.method
    };
    console.log('📤 Response:', JSON.stringify(errorResponse, null, 2));
    return res.status(405).json(errorResponse);
  }

  console.log('✅ STEP 1: Method validation passed - POST request received');

  try {
    console.log('✅ STEP 2: Starting login process');
    const { email, password } = req.body;
    console.log('📧 STEP 2: Extracted credentials:', { email: email ? '***@***' : 'MISSING', password: password ? '***' : 'MISSING' });

    if (!email || !password) {
      console.log('❌ STEP 2: Missing credentials');
      console.log('📤 Sending 400 response - Missing credentials');
      const errorResponse = { 
        success: false, 
        message: 'Email and password are required' 
      };
      console.log('📤 Response:', JSON.stringify(errorResponse, null, 2));
      return res.status(400).json(errorResponse);
    }

    console.log('✅ STEP 2: Credentials validation passed');

    // Initialize Supabase client
    console.log('✅ STEP 3: Initializing Supabase client');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';

    console.log('🔧 STEP 3: Environment variables check:');
    console.log('   SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.log('   SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
    console.log('   JWT_SECRET:', jwtSecret ? 'SET' : 'MISSING');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.log('❌ STEP 3: Missing Supabase configuration');
      console.log('📤 Sending 500 response - Configuration error');
      const errorResponse = { 
        success: false, 
        message: 'Server configuration error' 
      };
      console.log('📤 Response:', JSON.stringify(errorResponse, null, 2));
      return res.status(500).json(errorResponse);
    }

    // Use anon key for login, service key for profile retrieval
    console.log('✅ STEP 3: Creating Supabase clients');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ STEP 3: Supabase clients created successfully');

    // Authenticate user
    console.log('✅ STEP 4: Attempting Supabase authentication');
    console.log('🔐 STEP 4: Calling signInWithPassword...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('🔍 STEP 4: Authentication result:');
    console.log('   Auth Data:', authData ? 'SUCCESS' : 'NULL');
    console.log('   Auth Error:', authError ? JSON.stringify(authError, null, 2) : 'NONE');
    console.log('   User ID:', authData?.user?.id || 'NONE');

    if (authError || !authData.user) {
      console.log('❌ STEP 4: Authentication failed');
      console.log('📤 Sending 401 response - Invalid credentials');
      const errorResponse = { 
        success: false, 
        message: 'Invalid email or password' 
      };
      console.log('📤 Response:', JSON.stringify(errorResponse, null, 2));
      return res.status(401).json(errorResponse);
    }

    console.log('✅ STEP 4: Authentication successful');

    // Get user profile using admin client
    console.log('✅ STEP 5: Retrieving user profile');
    console.log('👤 STEP 5: Querying users table for ID:', authData.user.id);
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    console.log('🔍 STEP 5: Profile retrieval result:');
    console.log('   Profile Data:', userProfile ? 'SUCCESS' : 'NULL');
    console.log('   Profile Error:', profileError ? JSON.stringify(profileError, null, 2) : 'NONE');
    console.log('   User Email:', userProfile?.email || 'NONE');

    if (profileError || !userProfile) {
      console.log('❌ STEP 5: Profile retrieval failed');
      console.log('📤 Sending 500 response - Profile error');
      const errorResponse = { 
        success: false, 
        message: 'Failed to retrieve user profile' 
      };
      console.log('📤 Response:', JSON.stringify(errorResponse, null, 2));
      return res.status(500).json(errorResponse);
    }

    console.log('✅ STEP 5: Profile retrieval successful');

    // Generate JWT token
    console.log('✅ STEP 6: Generating JWT token');
    const token = jwt.sign(
      { 
        userId: userProfile.id, 
        email: userProfile.email, 
        role: userProfile.role 
      }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );
    console.log('✅ STEP 6: JWT token generated successfully');

    // Send success response
    console.log('✅ STEP 7: Sending success response');
    const successResponse = { 
      success: true, 
      message: 'Login successful', 
      user: userProfile, 
      token 
    };
    console.log('📤 STEP 7: Success response:', JSON.stringify(successResponse, null, 2));
    console.log('='.repeat(80));
    console.log('🎉 LOGIN FUNCTION COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    res.status(200).json(successResponse);

  } catch (error) {
    console.log('❌ CATCH BLOCK: Unexpected error occurred');
    console.log('🔍 Error details:', JSON.stringify(error, null, 2));
    console.log('📤 Sending 500 response - Internal server error');
    const errorResponse = { 
      success: false, 
      message: 'Internal server error during login', 
      error: error.message 
    };
    console.log('📤 Response:', JSON.stringify(errorResponse, null, 2));
    console.log('='.repeat(80));
    console.log('💥 LOGIN FUNCTION FAILED');
    console.log('='.repeat(80));
    res.status(500).json(errorResponse);
  }
};
