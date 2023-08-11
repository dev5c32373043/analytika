import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

import { Customer } from '../../customers/interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'passcode' });
  }

  async validate(email: string, passcode: string): Promise<Customer> {
    const customer = await this.authService.validateCustomer(email, passcode);
    if (!customer) {
      throw new RpcException({ message: 'Please check your login credentials', status: 401 });
    }

    return customer;
  }
}
