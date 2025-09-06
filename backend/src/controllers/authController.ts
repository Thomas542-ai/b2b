import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabaseAdmin } from '../config/supabase';

// Development mode flag
const isDevelopment = process.env.NODE_ENV === 'development';

// Mock user storage for development
const mockUsers: any[] = [];

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, company, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !company || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Development mode - use mock authentication
    if (isDevelopment) {
      // Check if user already exists in mock storage
      const existingUser = mockUsers.find(user => user.email === email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create mock user
      const mockUser = {
        id: `mock-${Date.now()}`,
        firstName,
        lastName,
        email,
        company,
        phone,
        isEmailVerified: true,
        isActive: true,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockUsers.push(mockUser);

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (Development Mode)',
        user: mockUser,
        token
      });
    }

    // Production mode - use Supabase
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file'
      });
    }

    const supabase = await getSupabaseAdmin();

    // Check if user already exists in Supabase Auth
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    
    const userExists = existingUser.users?.some((user: any) => user.email === email);
    
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

    if (authError || !authData.user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user account'
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
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
          role: 'USER',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
      // If profile creation fails, clean up the auth user
      console.error('Profile creation failed:', profileError);
      await supabase.auth.admin.deleteUser(authData.user.id);
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Development mode - use mock authentication
    if (isDevelopment) {
      // Find user in mock storage
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful (Development Mode)',
        user,
        token
      });
    }

    // Production mode - use Supabase
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file'
      });
    }

    const supabase = await getSupabaseAdmin();

    // Authenticate user with Supabase
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
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile'
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
