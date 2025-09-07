import { Controller, Get, Post, Body } from '@nestjs/common';
import { LeadSourcesService } from './lead-sources.service';

@Controller('lead-sources')
export class LeadSourcesController {
  constructor(private readonly leadSourcesService: LeadSourcesService) {}

  @Get()
  async getLeadSources() {
    return this.leadSourcesService.getLeadSources();
  }

  @Post('google-maps')
  async scrapeGoogleMaps(@Body() data: any) {
    return this.leadSourcesService.scrapeGoogleMaps(data);
  }

  @Post('linkedin')
  async scrapeLinkedIn(@Body() data: any) {
    return this.leadSourcesService.scrapeLinkedIn(data);
  }
}
