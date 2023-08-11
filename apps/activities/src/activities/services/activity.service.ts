import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Repository, InjectRepository } from '@dev5c32373043/nestjs-cassyllandra';

import { ActivityEntity } from '../models/activity.model';
import { ActivityTimeEntity } from '../models/activity-time.model';
import { ActivityOrderEntity } from '../models/activity-order.model';

import { ReportsNotifierService } from './reports-notifier.service';

import { omit } from '../../utils';

import { Activity, ActivityPayload, ActivityTime, ActivityQuery } from '../interfaces/activity.interface';

@Injectable()
export class ActivityService {
  constructor(
    private config: ConfigService,
    @InjectRepository(ActivityEntity)
    private activityRepository: Repository<ActivityEntity>,
    @InjectRepository(ActivityTimeEntity)
    private activityTimeRepository: Repository<ActivityTimeEntity>,
    @InjectRepository(ActivityOrderEntity)
    private activityOrderRepository: Repository<ActivityOrderEntity>,
    private reportsNotifier: ReportsNotifierService,
  ) {}

  async create(payload: ActivityPayload): Promise<Partial<Activity>> {
    if (!payload.time) {
      payload.time = new Date();
    }

    // Getting next position for timeid
    const nextPosition = await this.getNextPosition(payload.tenantId);
    // Generating timeid based on time and next position
    const timeid = (BigInt(new Date(payload.time).valueOf()) + nextPosition).toString();
    // Creating activity record
    const activity = await this.activityRepository.create({ ...payload, timeid });
    // Updating last position for next timeid
    await this.updateLastPosition(activity.tenantId);
    // Creating activity time record to get composite cluster key
    await this.createActivityTime({
      id: activity.id,
      tenantId: activity.tenantId,
      time: activity.time,
      timeid: activity.timeid,
    });

    this.reportsNotifier.notify('created', activity);

    return omit(activity, ['tenantId', 'timeid']);
  }

  async update(baseQuery: ActivityQuery, payload: ActivityPayload, opts = {}): Promise<Partial<Activity>> {
    const query = await this.buildQuery(baseQuery);
    if (!query) return null;

    const record = await this.activityRepository.findOne(query, { ...opts, raw: true });
    if (!record) return null;

    await this.activityRepository.update(query, payload);

    this.reportsNotifier.notify('updated', record, payload);

    const { action, username, value } = payload;
    return { ...record, action, username, value };
  }

  async delete(baseQuery: ActivityQuery) {
    const query = await this.buildQuery(baseQuery);
    if (!query) return null;

    const record = await this.activityRepository.findOne(query, { raw: true });
    if (!record) return null;

    await this.activityRepository.delete(query);
    await this.activityTimeRepository.delete({ tenantId: query.tenantId, id: query.id });

    this.reportsNotifier.notify('removed', record);

    return { ok: true };
  }

  async find(query: ActivityQuery, opts = {}) {
    const activities = await this.activityRepository.find(query, opts);
    return activities;
  }

  async findOne(baseQuery: ActivityQuery, opts = {}) {
    const query = await this.buildQuery(baseQuery);
    if (!query) return null;

    return this.activityRepository.findOne(query, opts);
  }

  async getActivityTime(tenantId: string, id: string): Promise<ActivityTime> {
    return this.activityTimeRepository.findOne({ tenantId, id }, { raw: true, select: ['time', 'timeid'] });
  }

  async createActivityTime(payload): Promise<void> {
    await this.activityTimeRepository.create(payload);
  }

  async getNextPosition(tenantId: string): Promise<bigint> {
    const activityOrder = await this.activityOrderRepository.findOne({ tenantId }, { raw: true, select: ['value'] });
    const value = activityOrder?.value ?? 0;

    return BigInt(value) + BigInt(1);
  }

  async updateLastPosition(tenantId: string): Promise<void> {
    const { source } = this.activityOrderRepository;
    await this.activityOrderRepository.executeQuery(
      `UPDATE ${source} SET "value" = "value" + 1 WHERE "tenantId" = ${tenantId}`,
    );
  }

  async buildQuery(baseQuery): Promise<ActivityQuery> {
    const { tenantId, id } = baseQuery;

    const activityExtra = await this.getActivityTime(tenantId, id);
    if (!activityExtra) return null;

    const { time, timeid } = activityExtra;
    return { ...baseQuery, id, tenantId, time, timeid };
  }

  // ⚠️ cleanup should be used only in the test environment ⚠️
  async cleanup(): Promise<void> {
    if (this.config.get('NODE_ENV') !== 'test') return;

    await this.activityRepository.truncate();
    await this.activityTimeRepository.truncate();
    await this.activityOrderRepository.truncate();
  }
}
