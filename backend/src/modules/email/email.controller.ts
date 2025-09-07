import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() data: any) {
    return this.emailService.sendEmail(data);
  }

  @Post('bulk-send')
  async sendBulkEmail(@Body() data: any) {
    return this.emailService.sendBulkEmail(data);
  }
}
