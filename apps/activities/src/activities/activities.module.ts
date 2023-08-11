import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

import { ActivitiesController } from './activities.controller';
import { ActivityService } from './services/activity.service';
import { ReportsNotifierService } from './services/reports-notifier.service';
import { CassyllandraModule } from '@dev5c32373043/nestjs-cassyllandra';
import { ActivityEntity } from './models/activity.model';
import { ActivityTimeEntity } from './models/activity-time.model';
import { ActivityOrderEntity } from './models/activity-order.model';

import { ConfigService } from '@nestjs/config';
import { PulsarModule } from '@dev5c32373043/nestjs-pulsar';

import { TenantsModule } from '../tenants/tenants.module';

import { PULSAR_PRODUCER, PULSAR_TOPIC, REPORTS_CLIENT, REPORTS_SERVICE } from '../constants';

@Module({
  imports: [
    TenantsModule,
    ClientsModule.register([{ name: REPORTS_CLIENT, transport: Transport.TCP }]),
    PulsarModule.forFeature('producer', PULSAR_PRODUCER, {
      topic: PULSAR_TOPIC,
    }),
    CassyllandraModule.forFeature([ActivityEntity, ActivityTimeEntity, ActivityOrderEntity]),
  ],
  controllers: [ActivitiesController],
  providers: [
    ActivityService,
    ReportsNotifierService,
    {
      provide: REPORTS_SERVICE,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const reportsServiceOptions = configService.get('reportsService');
        return ClientProxyFactory.create(reportsServiceOptions);
      },
    },
  ],
})
export class ActivitiesModule {}
