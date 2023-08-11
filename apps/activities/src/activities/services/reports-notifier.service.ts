import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { InjectPulsar, Producer } from '@dev5c32373043/nestjs-pulsar';

import { serializeMessageData, to } from '../../utils';

import { REPORTS_SERVICE, PULSAR_PRODUCER } from '../../constants';

import { ActivityPayload, ActivityMessage } from '../interfaces/activity.interface';

@Injectable()
export class ReportsNotifierService {
  private notificationDelay: number;
  private notificationSent = false;
  private logger: Logger = new Logger(ReportsNotifierService.name);

  constructor(
    @Inject(REPORTS_SERVICE) private reportsClient: ClientProxy,
    @InjectPulsar('producer', PULSAR_PRODUCER)
    private producer: Producer,
    private configService: ConfigService,
  ) {
    this.notificationDelay = configService.get('notificationDelay');
  }

  async notify(action: string, payload: ActivityPayload, updates?: ActivityPayload): Promise<void> {
    const data: ActivityMessage = { action, payload };

    if (updates) {
      data.updates = updates;
    }

    const [err] = await to(this.producer.send({ data: serializeMessageData(data) }));
    if (err) {
      this.logger.error(err);
      return;
    }

    if (this.notificationSent) return;

    this.reportsClient.emit('new-activity-received', { message: 'New activity received' });
    this.logger.log('Notifying reports service of new activity');

    this.notificationSent = true;

    setTimeout(() => {
      this.notificationSent = false;
      this.logger.log('Resetting notificationSent flag');
    }, this.notificationDelay);
  }
}
