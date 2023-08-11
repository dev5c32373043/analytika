import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';

import { ActivitiesService } from '../services/activities.service';

import { ActivitiesListQueryDto } from '../dto';

@Controller('/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async fetchActivities(@Query() query: ActivitiesListQueryDto, @Request() req) {
    return this.activitiesService.list(query, req.customer.apiToken);
  }
}
