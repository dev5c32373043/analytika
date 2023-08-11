import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';

import { ActivityReportsService } from './services/activity-reports.service';
import { JobManagerService } from './jobs/producers/job-manager.service';

import { ActivityTimelineParamsDto } from './dto';

@Controller('/reports')
export class ReportsController {
  constructor(private activityReportsService: ActivityReportsService, private jobManagerService: JobManagerService) {}

  @MessagePattern('reports.activities.timeline')
  async activitiesTimeline(params: ActivityTimelineParamsDto) {
    return this.activityReportsService.activitiesTimeline(params);
  }

  // Schedule a job to process new activities
  @EventPattern('new-activity-received')
  handleNewActivityReceived(): void {
    Logger.log('Received new activity event', 'ReportsController');
    this.jobManagerService.scheduleActivitiesJob();
  }

  @MessagePattern('reports.cleanup')
  async cleanup() {
    await this.activityReportsService.removeAll();
    return { ok: true };
  }
}
