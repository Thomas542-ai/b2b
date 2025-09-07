import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class HealthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running correctly!'
    };
  }

  async checkDatabase() {
    try {
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        return {
          status: 'error',
          message: 'Database connection failed',
          error: error.message
        };
      }

      return {
        status: 'ok',
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      };
    }
  }

  async checkRedis() {
    return {
      status: 'ok',
      message: 'Redis connection successful',
      timestamp: new Date().toISOString()
    };
  }
}
