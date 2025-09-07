import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class HealthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  async checkDatabase() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkRedis() {
    // For now, return a mock response
    // In a real implementation, you would check Redis connection
    return {
      status: 'ok',
      redis: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}
