import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Request,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateActivityDto, UpdateActivityDto, ListPayloadDto } from './dto';

import { ActivityService } from './services/activity.service';

import { AuthGuard } from '../tenants/auth.guard';

import { omit } from '../utils';

import { ActivityQuery } from './interfaces/activity.interface';

@Controller('activities')
export class ActivitiesController {
  private readonly activitySelect: string[];

  constructor(private readonly activityService: ActivityService) {
    this.activitySelect = ['id', 'action', 'username', 'time', 'timeid', 'value'];
  }

  @MessagePattern('activities.fetch')
  async list(payload: ListPayloadDto) {
    const { query, tenantId } = payload;
    const $limit = query.$limit ? Math.min(query.$limit, 1000) : 100;
    const filter: ActivityQuery = omit({ ...query, tenantId, $limit }, ['search', 'order', '$token']);

    if (query.search) {
      filter.action = { $like: `%${query.search}%` };
    }

    if (query.order) {
      filter.$orderby = { [query.order]: 'timeid' };
    }

    if (query.$token) {
      const operator = query.order === '$asc' ? '$gt' : '$lt';
      filter.timeid = { [operator]: query.$token };
    }

    return this.activityService.find(filter, {
      allow_filtering: true,
      select: this.activitySelect,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async fetchOne(@Param('id') id: string, @Request() req) {
    const activity = await this.activityService.findOne(
      { id, tenantId: req.tenantId },
      { select: this.activitySelect },
    );

    if (activity == null) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  @UseGuards(AuthGuard)
  @Post()
  async addActivity(@Body() payload: CreateActivityDto, @Request() req) {
    return this.activityService.create({ ...payload, tenantId: req.tenantId });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateActivity(@Param('id') id, @Body() payload: UpdateActivityDto, @Request() req) {
    const result = await this.activityService.update({ id, tenantId: req.tenantId }, payload, {
      select: this.activitySelect.filter(field => field !== 'timeid'),
    });

    if (result == null) {
      throw new NotFoundException('Activity not found');
    }

    return result;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async removeActivity(@Param('id') id: string, @Request() req) {
    const result = await this.activityService.delete({ id, tenantId: req.tenantId });

    if (result == null) {
      throw new NotFoundException('Activity not found');
    }

    return result;
  }

  @MessagePattern('activities.cleanup')
  async cleanup() {
    await this.activityService.cleanup();
    return { ok: true };
  }
}
