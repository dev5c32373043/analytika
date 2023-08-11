import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';

import { ReportsService } from '../services/reports.service';

import { ActivityTimelineReportQueryDto } from '../dto';

@Controller('/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Get('/activity/timeline')
  activityTimeline(@Query() query: ActivityTimelineReportQueryDto, @Request() req) {
    const params = { ...query, tenantId: req.customer.apiToken };
    return this.reportsService.activityTimeline(params);
  }
}
