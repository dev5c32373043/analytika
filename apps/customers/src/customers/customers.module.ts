import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Customer } from './customer.model';
import { AccessToken } from '../auth/access-token.model';
import { CustomersController } from './customers.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [SequelizeModule.forFeature([Customer, AccessToken])],
  exports: [CustomerService],
  controllers: [CustomersController],
  providers: [CustomerService],
})
export class CustomersModule {}
