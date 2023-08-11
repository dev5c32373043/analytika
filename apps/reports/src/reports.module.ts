import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PulsarModule } from '@dev5c32373043/nestjs-pulsar';

import { BullModule } from '@nestjs/bull';

import { JobManagerService } from './jobs/producers/job-manager.service';
import { ActivitiesConsumer } from './jobs/consumers/activities.consumer';

import { ReportsController } from './reports.controller';
import { ActivityReportsService } from './services/activity-reports.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ActivitySummary, ActivitySummarySchema } from './schemas/activity-summary.schema';
import { FailedOps, FailedOpsSchema } from './schemas/failed-ops.schema';

import { PULSAR_CONSUMER, PULSAR_CONSUMER_SUB, PULSAR_CONSUMER_TOPIC, JOB_QUEUE_NAME } from './constants';

import confSetup from './config/setup';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [confSetup] }),

    PulsarModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('pulsar'),
    }),
    PulsarModule.forFeature('consumer', PULSAR_CONSUMER, {
      subscription: PULSAR_CONSUMER_SUB,
      subscriptionType: 'Shared',
      topic: PULSAR_CONSUMER_TOPIC,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('db').mongoURI,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: ActivitySummary.name,
        schema: ActivitySummarySchema,
      },
      {
        name: FailedOps.name,
        schema: FailedOpsSchema,
      },
    ]),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get('redis'),
      }),
    }),
    BullModule.registerQueue({
      name: JOB_QUEUE_NAME,
    }),
  ],
  controllers: [ReportsController],
  providers: [ActivityReportsService, JobManagerService, ActivitiesConsumer],
})
export class ReportsModule {}
