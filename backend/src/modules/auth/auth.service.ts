import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, company } = registerDto;

    // Check if we're in demo mode
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
      // Return a mock successful registration for demo mode
      const payload = { email, sub: 'demo-user-id' };
      const token = this.jwtService.sign(payload);
      
      return {
        user: {
          id: 'demo-user-id',
          email,
          firstName,
          lastName,
          company,
        },
        token,
        message: 'Demo mode: Registration simulated successfully'
      };
    }

    // Check if user already exists
    const { data: existingUser } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        company,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        company: user.company,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Check if we're in demo mode
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
      // Return a mock successful login for demo mode
      const payload = { email, sub: 'demo-user-id' };
      const token = this.jwtService.sign(payload);
      
      return {
        user: {
          id: 'demo-user-id',
          email,
          firstName: 'Demo',
          lastName: 'User',
          company: 'Demo Company',
        },
        token,
        message: 'Demo mode: Login simulated successfully'
      };
    }

    // Find user
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        company: user.company,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id, email, first_name, last_name, company, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      company: user.company,
      createdAt: user.created_at,
    };
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async logout(userId: string) {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return { message: 'Logged out successfully' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Check if we're in demo mode
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
      // Return a mock user for demo mode
      return {
        id: 'demo-user-id',
        email,
        first_name: 'Demo',
        last_name: 'User',
        company: 'Demo Company',
      };
    }

    const { data: user } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
