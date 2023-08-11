import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CUSTOMERS_SERVICE } from '../constants';

@Injectable()
export class CustomersService {
  constructor(@Inject(CUSTOMERS_SERVICE) private customersClient: ClientProxy) {}

  async signIn(body) {
    return firstValueFrom(this.customersClient.send('auth.sign_in', { body }));
  }

  async signUp(body) {
    return firstValueFrom(this.customersClient.send('auth.sign_up', { body }));
  }

  async authorize(token: string) {
    return firstValueFrom(this.customersClient.send('auth.authorize', { body: { token } }));
  }

  async logout(customerId: number) {
    return firstValueFrom(this.customersClient.send('auth.logout', { body: { customerId } }));
  }
}
