import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  async getAllCampaigns() {
    return this.campaignsService.getAllCampaigns();
  }

  @Get('email')
  async getEmailCampaigns() {
    return this.campaignsService.getEmailCampaigns();
  }

  @Get('smtp')
  async getSMTPConfigs() {
    return this.campaignsService.getSMTPConfigs();
  }

  @Get(':id')
  async getCampaignById(@Param('id') id: string) {
    return this.campaignsService.getCampaignById(id);
  }

  @Post()
  async createCampaign(@Body() createCampaignDto: any) {
    return this.campaignsService.createCampaign(createCampaignDto);
  }

  @Put(':id')
  async updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: any) {
    return this.campaignsService.updateCampaign(id, updateCampaignDto);
  }

  @Delete(':id')
  async deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.deleteCampaign(id);
  }
}
