import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowAllOrigins = allowedOrigins.length === 0;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
