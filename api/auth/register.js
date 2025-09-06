const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    const { firstName, lastName, email, password, company, phone } = req.body;
    console.log('Vercel Register attempt:', { email, firstName, lastName });

    if (!firstName || !lastName || !email || !password || !company || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      console.error('Auth user creation failed:', authError);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to create user account', 
        error: authError?.message 
      });
    }

    // Create user profile in database
    let newUser, profileError;
    
    // Try camelCase first
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
      // Try snake_case if camelCase fails
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

    if (profileError || !newUser) {
      console.error('Profile creation failed:', profileError);
      // Clean up auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create user profile', 
        error: profileError?.message 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: newUser, 
      token 
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during registration', 
      error: error.message 
    });
  }
};
