import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { JOB_QUEUE_NAME, COMPUTE_ACTIVITIES_JOB } from '../../constants';

@Injectable()
export class JobManagerService {
  private logger: Logger;
  private activitiesJobScheduled: boolean;

  constructor(@InjectQueue(JOB_QUEUE_NAME) private activitiesQueue: Queue, private configService: ConfigService) {
    this.activitiesJobScheduled = false;
    this.logger = new Logger('JobManagerService');
  }

  scheduleActivitiesJob(): void {
    if (this.activitiesJobScheduled) {
      this.logger.log('Activities job already scheduled');
      return;
    }

    this.logger.log('Scheduling activities processing job...');

    const jobOptions = { attempts: 3, delay: this.configService.get('computeActivitiesDelay'), removeOnComplete: true };
    this.activitiesQueue.add(COMPUTE_ACTIVITIES_JOB, {}, jobOptions);

    this.activitiesJobScheduled = true;
  }

  jobCompleted(jobType: string): void {
    if (jobType !== COMPUTE_ACTIVITIES_JOB) return;

    this.logger.log('Resetting activitiesJobScheduled flag');
    this.activitiesJobScheduled = false;
  }
}
