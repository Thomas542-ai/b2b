import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardAnalytics() {
    return this.analyticsService.getDashboardAnalytics();
  }

  @Get('leads')
  async getLeadAnalytics() {
    return this.analyticsService.getLeadAnalytics();
  }

  @Get('campaigns')
  async getCampaignAnalytics() {
    return this.analyticsService.getCampaignAnalytics();
  }
}
