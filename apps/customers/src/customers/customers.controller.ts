import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CustomerService } from './customer.service';

@Controller()
export class CustomersController {
  constructor(private customerService: CustomerService) {}

  @MessagePattern('customers.cleanup')
  async cleanup() {
    await this.customerService.cleanup();
    return { ok: true };
  }
}
