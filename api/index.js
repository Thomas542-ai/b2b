// Express server approach for Vercel
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Express server is working!',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('Express login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: userProfile.id, email: userProfile.email, role: userProfile.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: userProfile,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Express register attempt:', req.body);
    const { firstName, lastName, email, password, company, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !company || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError || !authData.user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account',
        error: authError?.message
      });
    }

    // Create user profile
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
      return res.status(500).json({
        success: false,
        message: 'Failed to create user profile',
        error: profileError?.message
      });
    }

    // Generate JWT
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
      error: error.message
    });
  }
});

// Export for Vercel
module.exports = app;
