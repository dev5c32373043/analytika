import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';

import { TenantService } from './tenant.service';

import { to } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private tenantService: TenantService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['api-token'];

    if (!tenantId || tenantId.trim().length === 0) {
      throw new UnauthorizedException('Please check your credentials');
    }

    const [err, isAuthorized] = await to(this.tenantService.authorize(tenantId));
    if (err) {
      this.logger.error(err);
      throw new UnauthorizedException({ message: err.message });
    }

    if (!isAuthorized) {
      throw new UnauthorizedException('Please check your credentials');
    }

    request.tenantId = tenantId;

    return true;
  }
}
