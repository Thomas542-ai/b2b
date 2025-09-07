import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe')
  async createStripePayment(@Body() data: any) {
    return this.paymentService.createStripePayment(data);
  }

  @Post('paypal')
  async createPayPalPayment(@Body() data: any) {
    return this.paymentService.createPayPalPayment(data);
  }

  @Post('razorpay')
  async createRazorpayPayment(@Body() data: any) {
    return this.paymentService.createRazorpayPayment(data);
  }
}
