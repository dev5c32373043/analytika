import { Logger } from '@nestjs/common';

import { Processor, Process, OnQueueActive, OnQueueError, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';

import dayjs from 'dayjs';

import { InjectPulsar, Consumer } from '@dev5c32373043/nestjs-pulsar';
import { ConfigService } from '@nestjs/config';

import { JobManagerService } from '../producers/job-manager.service';
import { ActivityReportsService } from '../../services/activity-reports.service';

import { messageToObject, to } from '../../utils';

import { ActivityMessage, ActivitiesJobResult } from '../interfaces';

import { PULSAR_CONSUMER, JOB_QUEUE_NAME, COMPUTE_ACTIVITIES_JOB } from '../../constants';

@Processor(JOB_QUEUE_NAME)
export class ActivitiesConsumer {
  private logger: Logger = new Logger(ActivitiesConsumer.name);
  private pulsarReceiveTimeout: number;

  constructor(
    private jobManagerService: JobManagerService,
    @InjectPulsar('consumer', PULSAR_CONSUMER) private readonly consumer: Consumer,
    private activityReportsService: ActivityReportsService,
    private config: ConfigService,
  ) {
    this.pulsarReceiveTimeout = this.config.get('pulsarReceiveTimeout');
  }

  @Process(COMPUTE_ACTIVITIES_JOB)
  async computeActivities(job: Job) {
    this.logger.log(`Job: ${job.id} started to process activities...`);

    const result = await this.performActivitiesCalculation();
    // Cleaning up activities with 0 count
    const [cleanupErr, removalResult] = await to(this.activityReportsService.cleanupActivities());
    if (cleanupErr) {
      this.logger.error(cleanupErr);
    }

    if (removalResult?.acknowledged) {
      this.logger.log(`Removed ${removalResult.deletedCount} activities with 0 count`);
    }

    return result;
  }

  async performActivitiesCalculation(
    computeResult: Map<string, any> = new Map(),
    jobResult: ActivitiesJobResult = { activitiesCount: 0 },
  ): Promise<ActivitiesJobResult> {
    // Receiving message from the consumer with a timeout
    const [err, rawMessage] = await to(this.consumer.receive(this.pulsarReceiveTimeout));
    // If there no message in the queue, saving compute results and returning the job result
    if (err) {
      if (err.message !== 'Failed to receive message: TimeOut') {
        this.logger.error(err);
      }

      // Saving last compute results
      if (computeResult.size > 0) {
        this.logger.log(`Saving ${computeResult.size} activities...`);
        const writeResult = await this.activityReportsService.upsertActivities(Array.from(computeResult.values()));
        this.logger.log(writeResult);
      }

      return jobResult;
    }

    const message: ActivityMessage = messageToObject<ActivityMessage>(rawMessage);
    // Processing the message
    const { action, payload, updates } = message;

    const tenantKey = `${payload.tenantId}-${payload.action}`;

    // Adding new entry if not exists
    if (!computeResult.has(tenantKey)) {
      computeResult.set(tenantKey, {
        action: payload.action,
        tenantId: payload.tenantId,
        timeline: {},
        totalCount: 0,
      });
    }

    // Preparing update for timeline & total count
    const currentEntity = computeResult.get(tenantKey);
    const dateKey = dayjs(payload.time).format('MM/DD/YYYY');

    currentEntity.timeline[dateKey] ||= 0;

    // When activity created we increment value in the timeline and total count
    if (action === 'created') {
      currentEntity.timeline[dateKey] += 1;
      currentEntity.totalCount += 1;
    }

    // When activity updated we perform changes according to the changes
    if (action === 'updated') {
      // If action changed we need to update the timeline for previous action and add new one
      if (payload.action !== updates.action) {
        currentEntity.timeline[dateKey] -= 1;
        currentEntity.totalCount -= 1;

        const newTenantKey = `${payload.tenantId}-${updates.action}`;

        if (!computeResult.has(newTenantKey)) {
          computeResult.set(newTenantKey, {
            action: updates.action,
            tenantId: payload.tenantId,
            timeline: { [dateKey]: 0 },
            totalCount: 0,
          });
        }

        const newEntity = computeResult.get(newTenantKey);

        newEntity.timeline[dateKey] += 1;
        newEntity.totalCount += 1;
      }
    }

    // When activity removed we decrement value in the timeline and total count
    if (action === 'removed') {
      currentEntity.timeline[dateKey] -= 1;
      currentEntity.totalCount -= 1;
    }

    jobResult.activitiesCount += 1;

    // Marking the message as consumed
    await this.consumer.acknowledge(rawMessage);

    // Saving results when passing defined threshold
    if (computeResult.size >= 1000) {
      const writeResult = await this.activityReportsService.upsertActivities(Array.from(computeResult.values()));
      this.logger.log(writeResult, 'upsertActivities');
      computeResult.clear();
    }

    // Recursively calling the function until there are no more messages in the queue
    return this.performActivitiesCalculation(computeResult, jobResult);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}...`);
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error(`Error processing job: ${error.message}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: ActivitiesJobResult) {
    this.jobManagerService.jobCompleted(job.name);
    this.logger.log(`Job ${job.id} of type ${job.name} completed. ${result.activitiesCount} activities processed`);
  }
}
