import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { Customer } from './customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
    private config: ConfigService,
  ) {}

  async create(payload): Promise<Customer> {
    return this.customerModel.create(payload);
  }

  async findOne(where): Promise<Customer> {
    return this.customerModel.findOne({ where });
  }

  // ⚠️ cleanup should be used only in the test environment ⚠️
  async cleanup(): Promise<void> {
    if (this.config.get('NODE_ENV') !== 'test') return;

    await this.customerModel.truncate({ cascade: true });
  }
}
