import { Inject, Controller, Delete } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ACTIVITIES_SERVICE, CUSTOMERS_SERVICE, REPORTS_SERVICE } from '../src/constants';

// ⚠️ Edit only if you know what you're doing! The CleanupController is used in the test environment ⚠️
@Controller('/cleanup')
export class CleanupController {
  constructor(
    private config: ConfigService,
    @Inject(ACTIVITIES_SERVICE) private activitiesClient: ClientProxy,
    @Inject(CUSTOMERS_SERVICE) private customersClient: ClientProxy,
    @Inject(REPORTS_SERVICE) private reportsClient: ClientProxy,
  ) {}

  @Delete()
  async cleanupTestData() {
    if (this.config.get('env') !== 'test') return;

    await Promise.all([
      firstValueFrom(this.activitiesClient.send('activities.cleanup', { message: 'cleanup the mess' })),
      firstValueFrom(this.customersClient.send('customers.cleanup', { message: 'cleanup the mess' })),
      firstValueFrom(this.reportsClient.send('reports.cleanup', { message: 'cleanup the mess' })),
    ]);

    return { ok: true };
  }
}
