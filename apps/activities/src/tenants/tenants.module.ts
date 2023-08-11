import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigService } from '@nestjs/config';

import { TenantService } from './tenant.service';
import { CassyllandraModule } from '@dev5c32373043/nestjs-cassyllandra';
import { TenantEntity } from './tenant.model';

import { CUSTOMERS_CLIENT, CUSTOMERS_SERVICE } from '../constants';

@Module({
  imports: [
    ClientsModule.register([{ name: CUSTOMERS_CLIENT, transport: Transport.TCP }]),
    CassyllandraModule.forFeature([TenantEntity]),
  ],
  providers: [
    TenantService,
    {
      provide: CUSTOMERS_SERVICE,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const customersServiceOptions = configService.get('customersService');
        return ClientProxyFactory.create(customersServiceOptions);
      },
    },
  ],
  exports: [TenantService],
})
export class TenantsModule {}
