import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from '../../src/config/supabase';

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

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const supabase = await getSupabaseAdmin();

    // Use Supabase Auth for login
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

    // Get user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(401).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Check if user is active
    if (!userProfile.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { userId: userProfile.id, email: userProfile.email, role: userProfile.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Update last login
    await supabase
      .from('users')
      .update({ lastLoginAt: new Date().toISOString() })
      .eq('id', userProfile.id);

    // Remove sensitive fields from response
    const { password: _, ...userWithoutPassword } = userProfile;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
}
