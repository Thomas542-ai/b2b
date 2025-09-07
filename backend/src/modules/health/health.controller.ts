import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async checkHealth() {
    return this.healthService.checkHealth();
  }

  @Get('db')
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }

  @Get('redis')
  async checkRedis() {
    return this.healthService.checkRedis();
  }

  @Get('test')
  async testEndpoint() {
    return {
      message: 'Backend is running correctly!',
      timestamp: new Date().toISOString(),
      status: 'success',
      endpoints: {
        health: '/api/health',
        database: '/api/health/db',
        redis: '/api/health/redis',
        auth: '/api/auth/*',
        leads: '/api/leads/*',
        campaigns: '/api/campaigns/*',
        analytics: '/api/analytics/*'
      }
    };
  }
}