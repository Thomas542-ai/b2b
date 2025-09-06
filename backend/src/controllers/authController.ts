import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from '../config/supabase';

// Always use Supabase for authentication
// Mock user storage removed - using Supabase for all environments

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, company, phone } = req.body;
    console.log('Registration attempt:', { email, firstName, lastName });

    if (!firstName || !lastName || !email || !password || !company || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Use Supabase for all environments
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file'
      });
    }

    const supabase = await getSupabaseAdmin();
    console.log('Supabase admin client obtained');

    // Check if user already exists in Supabase Auth by trying to get user by email
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000 // Get more users to check
    });
    
    console.log('Existing users check:', { userCount: existingUser?.users?.length, checkError });
    const userExists = existingUser?.users?.some((user: any) => user.email === email);
    
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
    // Try different column name formats to handle schema variations
    let newUser, profileError;
    
    // First try camelCase (from migration file)
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
      // If profile creation fails, clean up the auth user
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
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Use Supabase for all environments
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file'
      });
    }

    const supabase = await getSupabaseAdmin();
    console.log('Supabase admin client obtained for login');

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

    return res.json({
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
};
