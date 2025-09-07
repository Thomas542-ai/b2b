import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  private readonly usersFile = path.join(__dirname, '..', '..', '..', 'users.json');

  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService
  ) {
    this.initializeUsersFile();
  }

  private isDemoMode(): boolean {
    return !process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co';
  }

  private initializeUsersFile() {
    if (!fs.existsSync(this.usersFile)) {
      const initialUsers = {
        "admin@example.com": {
          id: "1",
          email: "admin@example.com",
          password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K", // "admin123"
          firstName: "Admin",
          lastName: "User",
          company: "Admin Company",
          role: "ADMIN",
          createdAt: new Date().toISOString()
        }
      };
      fs.writeFileSync(this.usersFile, JSON.stringify(initialUsers, null, 2));
    }
  }

  private readUsers(): Record<string, any> {
    if (!fs.existsSync(this.usersFile)) {
      return {};
    }
    const data = fs.readFileSync(this.usersFile, 'utf8');
    return JSON.parse(data);
  }

  private writeUsers(users: Record<string, any>) {
    fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, company } = registerDto;

    if (this.isDemoMode()) {
      return this.registerDemo(registerDto);
    }

    return this.registerSupabase(registerDto);
  }

  private async registerDemo(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, company } = registerDto;

    // Check if user already exists
    const users = this.readUsers();
    if (users[email]) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      company,
      role: 'USER',
      createdAt: new Date().toISOString()
    };

    // Save user
    users[email] = newUser;
    this.writeUsers(users);

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        company: newUser.company,
        role: newUser.role
      },
      token,
      message: 'Registration successful (Demo Mode)'
    };
  }

  private async registerSupabase(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, company } = registerDto;

    // Check if user already exists in Supabase
    const { data: existingUser, error: checkError } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    // If user exists (no error means user found)
    if (existingUser && !checkError) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Supabase
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        firstname: firstName,
        lastname: lastName,
        company,
        role: 'USER',
        createdat: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        company: user.company,
        role: user.role
      },
      token,
      message: 'Registration successful (Supabase)'
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (this.isDemoMode()) {
      return this.loginDemo(loginDto);
    }

    return this.loginSupabase(loginDto);
  }

  private async loginDemo(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Get user from file
    const users = this.readUsers();
    const user = users[email];

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role
      },
      token,
      message: 'Login successful (Demo Mode)'
    };
  }

  private async loginSupabase(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Get user from Supabase
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        company: user.company,
        role: user.role
      },
      token,
      message: 'Login successful (Supabase)'
    };
  }

  async validateUser(email: string, password: string) {
    if (this.isDemoMode()) {
      const users = this.readUsers();
      const user = users[email];

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role
      };
    }

    // Supabase validation
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      company: user.company,
      role: user.role
    };
  }

  async getProfile(userId: string) {
    if (this.isDemoMode()) {
      const users = this.readUsers();
      const user = Object.values(users).find((u: any) => u.id === userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role
      };
    }

    // Supabase profile
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id, email, firstname, lastname, company, role')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      company: user.company,
      role: user.role
    };
  }

  async logout() {
    return { message: 'Logout successful' };
  }
}