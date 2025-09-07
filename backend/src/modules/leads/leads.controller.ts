import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  async getAllLeads() {
    return this.leadsService.getAllLeads();
  }

  @Get(':id')
  async getLeadById(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Post()
  async createLead(@Body() createLeadDto: any) {
    return this.leadsService.createLead(createLeadDto);
  }

  @Put(':id')
  async updateLead(@Param('id') id: string, @Body() updateLeadDto: any) {
    return this.leadsService.updateLead(id, updateLeadDto);
  }

  @Delete(':id')
  async deleteLead(@Param('id') id: string) {
    return this.leadsService.deleteLead(id);
  }
}
