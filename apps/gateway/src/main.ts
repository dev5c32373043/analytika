import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import config from './config/setup';

async function bootstrap() {
  const { host, port } = config();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Enable payload validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port);

  Logger.log(`🚀 App is running on: http://${host}:${port}`);
}

bootstrap();
