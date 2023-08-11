import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { RootModule } from './root.module';

import config from './config/setup';

async function bootstrap() {
  const { host, port } = config();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RootModule, {
    transport: Transport.TCP,
    options: { host, port },
  });

  // Enable payload validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen();

  Logger.log(`🚀 Customers microservice is running on: ${host}:${port}`);
}

bootstrap();
