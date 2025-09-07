const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  try {
    // Health check
    if (pathname === '/api/health') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Backend is running correctly!',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth/*',
          leads: '/api/leads/*',
          campaigns: '/api/campaigns/*'
        }
      });
    }

    // Auth routes
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const { email, password, firstName, lastName, company, phone } = req.body;

      if (!email || !password || !firstName || !lastName || !company) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: email, password, firstName, lastName, company'
        });
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          company,
          phone: phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database error:', insertError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
      });
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    }

    // Default 404 for unmatched routes
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      path: pathname
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
