// Individual serverless function for register
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      message: 'Method not allowed',
      method: req.method
    });
    return;
  }
  
  try {
    const { firstName, lastName, email, password, company, phone } = req.body;
    
    if (!firstName || !lastName || !email || !password || !company || !phone) {
      res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
      return;
    }
    
    // Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
      return;
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError || !authData.user) {
      res.status(400).json({
        success: false,
        message: 'Failed to create user account',
        error: authError?.message
      });
      return;
    }
    
    // Create profile
    const { data: newUser, error: profileError } = await supabaseAdmin
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
    
    if (profileError || !newUser) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      res.status(500).json({
        success: false,
        message: 'Failed to create user profile',
        error: profileError?.message
      });
      return;
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
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
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};
