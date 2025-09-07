import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('leads')
  async getLeadAnalytics() {
    return this.analyticsService.getLeadAnalytics();
  }

  @Get('campaigns')
  async getCampaignAnalytics() {
    return this.analyticsService.getCampaignAnalytics();
  }

  @Get('revenue')
  async getRevenueAnalytics() {
    return this.analyticsService.getRevenueAnalytics();
  }
}
