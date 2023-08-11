import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ACTIVITIES_SERVICE } from '../constants';

@Injectable()
export class ActivitiesService {
  constructor(@Inject(ACTIVITIES_SERVICE) private activitiesClient: ClientProxy) {}

  async list(query, tenantId: string) {
    return firstValueFrom(this.activitiesClient.send('activities.fetch', { query, tenantId }));
  }
}
