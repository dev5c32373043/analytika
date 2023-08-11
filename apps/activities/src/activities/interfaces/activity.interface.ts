import { FindQuery } from '@dev5c32373043/nestjs-cassyllandra';
import { ActivityEntity } from '../models/activity.model';

export interface Activity {
  id: string;
  tenantId: string;
  action: string;
  username: string;
  time: Date;
  timeid: string;
  value: number;
}

export interface ActivityTime {
  id: string;
  tenantId: string;
  time: Date;
  timeid: string;
}

export type ActivityQuery = FindQuery<ActivityEntity>;

export type ActivityPayload = Partial<Activity>;

export interface ActivityMessage {
  action: string;
  payload: ActivityPayload;
  updates?: ActivityPayload;
}
