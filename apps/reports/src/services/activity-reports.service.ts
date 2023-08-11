import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import dayjs from 'dayjs';

import { ActivitySummary } from '../schemas/activity-summary.schema';
import { FailedOps } from '../schemas/failed-ops.schema';

import { to, getDateRange } from '../utils';

import { ActivityTimelineReport, ActivityTimelineFilter } from '../interfaces';

@Injectable()
export class ActivityReportsService {
  private logger: Logger;

  constructor(
    @InjectModel(ActivitySummary.name) private activitySummaryModel: Model<ActivitySummary>,
    @InjectModel(FailedOps.name) private failedOpsModel: Model<FailedOps>,
    private config: ConfigService,
  ) {
    this.logger = new Logger('ActivityReportsService');
  }

  async activitiesTimeline(params): Promise<ActivityTimelineReport> {
    const { tenantId, action } = params;

    const temporalUnit = 'month'; // For now, we only support month
    const dateFormat = 'MMM';
    const keyFormat = 'MM/DD/YYYY';

    const filter: ActivityTimelineFilter = { tenantId };
    const select: string[] = [];

    if (action) {
      filter.action = action;
    }

    if (temporalUnit === 'month') {
      filter.$or = [];

      const now = new Date();
      const startOfYear = dayjs().startOf('year').toDate();
      const ranges = getDateRange(startOfYear, now, keyFormat);

      for (const date of ranges) {
        const key = `timeline.${date}`;
        filter.$or.push({ [key]: { $gt: 0 } });
        select.push(key);
      }
    }

    const activityByDate = {};
    const docs = this.activitySummaryModel.find(filter).select(select).lean();

    for await (const doc of docs) {
      for (const date in doc.timeline) {
        const dateKey = dayjs(date).format(dateFormat);
        activityByDate[dateKey] ||= 0;
        activityByDate[dateKey] += doc.timeline[date];
      }
    }

    const [sortedKeys, sortedValues] = this.sortByMonth(activityByDate);

    return {
      labels: sortedKeys,
      datasets: [{ label: 'Activities', data: sortedValues }],
    };
  }

  sortByMonth(obj): [string[], number[]] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedKeys = Object.keys(obj).sort((k1, k2) => months.indexOf(k1) - months.indexOf(k2));
    const sortedValues = sortedKeys.map(k => obj[k]);

    return [sortedKeys, sortedValues];
  }

  async upsertActivities(payload) {
    const ops = payload.map(item => {
      const timelineUpdate = {};

      for (const date in item.timeline) {
        timelineUpdate[`timeline.${date}`] = item.timeline[date];
      }

      const $inc = { ...timelineUpdate, totalCount: item.totalCount };

      return {
        updateOne: {
          filter: { tenantId: item.tenantId, action: item.action },
          update: { $set: { tenantId: item.tenantId, action: item.action }, $inc },
          upsert: true,
        },
      };
    });

    const [bulkErr] = await to(this.activitySummaryModel.bulkWrite(ops));
    if (bulkErr) {
      this.logger.error(bulkErr);

      const [err] = await to(this.saveFailedOps('activity-summary', ops));
      if (err) {
        this.logger.error(err);
      }
    }
  }

  async saveFailedOps(model: string, ops: any[]): Promise<void> {
    await this.failedOpsModel.create({ model, ops });
  }

  // TODO: cleanup empty timeline values as well
  async cleanupActivities() {
    return this.activitySummaryModel.deleteMany({ totalCount: 0 });
  }

  // ⚠️ removeAll should be used only in the test environment ⚠️
  async removeAll(): Promise<void> {
    if (this.config.get('NODE_ENV') !== 'test') return;

    await this.activitySummaryModel.deleteMany({});
    await this.failedOpsModel.deleteMany({});
  }
}
