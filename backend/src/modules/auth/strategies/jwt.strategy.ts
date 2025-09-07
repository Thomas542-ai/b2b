import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly supabaseService: SupabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Handle demo mode
    if (payload.sub === 'demo-user-id') {
      return {
        id: 'demo-user-id',
        email: payload.email,
        firstName: 'Demo',
        lastName: 'User',
        company: 'Demo Company',
      };
    }

    const { data: user } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id, email, first_name, last_name, company')
      .eq('id', payload.sub)
      .single();

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      company: user.company,
    };
  }
}
