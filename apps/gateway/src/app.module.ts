import { Module } from '@nestjs/common';

import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

import { ActivitiesController } from './controllers/activities.controller';
import { ReportsController } from './controllers/reports.controller';
import { CustomersController } from './controllers/customers.controller';
import { CleanupController } from '../test/cleanup.controller';

import { ActivitiesService } from './services/activities.service';
import { ReportsService } from './services/reports.service';
import { CustomersService } from './services/customers.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import confSetup from './config/setup';

import {
  ACTIVITIES_CLIENT,
  REPORTS_CLIENT,
  CUSTOMERS_CLIENT,
  ACTIVITIES_SERVICE,
  REPORTS_SERVICE,
  CUSTOMERS_SERVICE,
} from './constants';

const controllers: any[] = [ActivitiesController, ReportsController, CustomersController];
// ⚠️ Do not edit under any circumstances! CleanupController is only used in the test environment ⚠️
if (process.env.NODE_ENV === 'test') {
  controllers.push(CleanupController);
}

@Module({
  controllers,
  imports: [
    ConfigModule.forRoot({ load: [confSetup] }),
    ClientsModule.register([
      { name: ACTIVITIES_CLIENT, transport: Transport.TCP },
      { name: CUSTOMERS_CLIENT, transport: Transport.TCP },
      { name: REPORTS_CLIENT, transport: Transport.TCP },
    ]),
  ],
  providers: [
    {
      provide: ACTIVITIES_SERVICE,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const activitiesServiceOptions = configService.get('activitiesService');
        return ClientProxyFactory.create(activitiesServiceOptions);
      },
    },
    {
      provide: CUSTOMERS_SERVICE,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const customersServiceOptions = configService.get('customersService');
        return ClientProxyFactory.create(customersServiceOptions);
      },
    },
    {
      provide: REPORTS_SERVICE,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const reportsServiceOptions = configService.get('reportsService');
        return ClientProxyFactory.create(reportsServiceOptions);
      },
    },
    ActivitiesService,
    ReportsService,
    CustomersService,
  ],
})
export class AppModule {}
