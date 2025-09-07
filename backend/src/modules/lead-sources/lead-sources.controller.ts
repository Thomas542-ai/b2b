import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { LeadSourcesService } from './lead-sources.service';

@Controller('lead-sources')
export class LeadSourcesController {
  constructor(private readonly leadSourcesService: LeadSourcesService) {}

  @Get()
  async getAllLeadSources() {
    return this.leadSourcesService.getAllLeadSources();
  }

  @Get(':id')
  async getLeadSourceById(@Param('id') id: string) {
    return this.leadSourcesService.getLeadSourceById(id);
  }

  @Post()
  async createLeadSource(@Body() createLeadSourceDto: any) {
    return this.leadSourcesService.createLeadSource(createLeadSourceDto);
  }

  @Put(':id')
  async updateLeadSource(@Param('id') id: string, @Body() updateLeadSourceDto: any) {
    return this.leadSourcesService.updateLeadSource(id, updateLeadSourceDto);
  }

  @Delete(':id')
  async deleteLeadSource(@Param('id') id: string) {
    return this.leadSourcesService.deleteLeadSource(id);
  }
}
