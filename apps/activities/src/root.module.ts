import { Module } from '@nestjs/common';

import { CassyllandraModule } from '@dev5c32373043/nestjs-cassyllandra';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PulsarModule } from '@dev5c32373043/nestjs-pulsar';

import { ActivitiesModule } from './activities/activities.module';

import confSetup from './config/setup';

@Module({
  imports: [
    ActivitiesModule,
    ConfigModule.forRoot({ load: [confSetup], isGlobal: true }),
    PulsarModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('pulsar'),
    }),
    CassyllandraModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return { ...configService.get('scylladb') };
      },
    }),
  ],
  providers: [ConfigService],
})
export class RootModule {}
