import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { REPORTS_SERVICE } from '../constants';

@Injectable()
export class ReportsService {
  constructor(@Inject(REPORTS_SERVICE) private reportsClient: ClientProxy) {}

  async activityTimeline(params) {
    return firstValueFrom(this.reportsClient.send('reports.activities.timeline', params));
  }
}
