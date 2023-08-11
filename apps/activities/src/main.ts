import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { RootModule } from './root.module';

import config from './config/setup';

async function bootstrap() {
  const { tcpHost, tcpPort, httpPort } = config();

  const app = await NestFactory.create<NestFastifyApplication>(RootModule, new FastifyAdapter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: tcpHost, port: tcpPort },
  });

  app.setGlobalPrefix('api');

  // Enable payload validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable listening for shutdown hooks
  app.enableShutdownHooks();

  await app.startAllMicroservices();

  await app.listen(httpPort);

  Logger.log(`🚀 Activities microservice is running on: ${tcpHost}:${tcpPort}`);
  Logger.log(`🚀 Activities http server is running on: http://localhost:${httpPort}`);
}

bootstrap();
