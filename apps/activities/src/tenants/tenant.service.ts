import { Inject, Injectable, HttpStatus, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Repository, InjectRepository } from '@dev5c32373043/nestjs-cassyllandra';

import { TenantEntity } from './tenant.model';
import { CUSTOMERS_SERVICE } from '../constants';
import { to } from '../utils';

@Injectable()
export class TenantService {
  private logger: Logger = new Logger(TenantService.name);

  constructor(
    @Inject(CUSTOMERS_SERVICE) private customersClient: ClientProxy,
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
  ) {}
  // authorize method is used to check if the tenant is authorized to use the service
  async authorize(id: string): Promise<boolean> {
    // check if tenant is already stored in the database
    const tenant = await this.tenantRepository.findOne({ id });

    if (tenant?.id === id) return true;
    // if tenant is not stored in the database, check if it is authorized to use the service
    const resp = await firstValueFrom(this.customersClient.send('auth.authorize_api_token', id));

    if (resp.status !== HttpStatus.OK) return false;
    // if tenant is authorized, store it in the database
    const [createErr] = await to(this.create(id));
    if (createErr) {
      this.logger.error(createErr);
    }

    return true;
  }

  // storing tenant for 1 day to avoid unnecessary requests to customers service
  async create(id: string): Promise<void> {
    await this.tenantRepository.create({ id }, { ttl: 86400 });
  }
}
