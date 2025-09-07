import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('send')
  async sendMessage(@Body() data: any) {
    return this.whatsappService.sendMessage(data);
  }

  @Post('bulk-send')
  async sendBulkMessage(@Body() data: any) {
    return this.whatsappService.sendBulkMessage(data);
  }
}
