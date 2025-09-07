import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
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

  @Get('activity')
  async getActivityAnalytics() {
    return this.analyticsService.getActivityAnalytics();
  }
}
