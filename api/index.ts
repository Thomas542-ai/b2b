import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from '../backend/src/app.module';
import { Logger } from '../backend/src/utils/logger';

let app: any;

async function createNestApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Security middleware
    app.use(helmet());
    app.use(compression());

    // CORS configuration
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Global prefix
    app.setGlobalPrefix('api');

    await app.init();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  const nestApp = await createNestApp();
  return nestApp.getHttpAdapter().getInstance()(req, res);
}
