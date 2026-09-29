import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { resolve } from 'path';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EverAfter API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Serve uploaded files
  const configService = app.get(ConfigService);
  const uploadDir = resolve(configService.get<string>('UPLOAD_DIR', './uploads'));
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  const port = process.env.API_PORT ?? 3001;
  await app.listen(port);

  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger UI at http://localhost:${port}/api/docs`);
}

void bootstrap();
