import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';

import { CustomersService } from '../services/customers.service';

import { to } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly customersService: CustomersService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization = '' } = request.headers;
    const [type, token] = authorization.split(' ') ?? [];

    if (type !== 'Bearer' || !token?.length) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const [err, response] = await to(this.customersService.authorize(token));
    if (err) {
      this.logger.error(err);
      throw new UnauthorizedException({ message: err.message });
    }

    request.customer = response.data;

    return true;
  }
}
