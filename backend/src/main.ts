import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ─── Global API Prefix ───────────────────────────────────────────
  app.setGlobalPrefix('api', {
    exclude: ['/health', '/'],
  });

  // ─── API Versioning (Future-proof) ───────────────────────────────
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ─── Security ────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  // ─── Compression ─────────────────────────────────────────────────
  app.use(compression());

  // ─── CORS — Strict Production Config ─────────────────────────────
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : ['https://smartfyai.com', 'https://www.smartfyai.com'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, health checks)
      if (!origin) return callback(null, true);

      // In development, allow all localhost ports
      if (
        process.env.NODE_ENV !== 'production' &&
        /^http:\/\/localhost(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`Blocked CORS request from origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-API-Key',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  });

  // ─── Global Exception Filter ──────────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ─── Global Validation Pipe ───────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // ─── Graceful Shutdown ────────────────────────────────────────────
  app.enableShutdownHooks();

  // ─── Start Server ─────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3000', 10);
  const host = '0.0.0.0';

  await app.listen(port, host);

  logger.log(`🚀 SmartfyAI API running on http://${host}:${port}`);
  logger.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  logger.log(`🔗 Health Check: http://${host}:${port}/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
