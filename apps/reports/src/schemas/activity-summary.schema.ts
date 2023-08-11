import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivitySummaryDocument = HydratedDocument<ActivitySummary>;

@Schema()
export class ActivitySummary {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ type: Object, default: () => ({}) })
  timeline: { [key: string]: number }; // { 'MM/DD/YYYY': 1 }

  @Prop({ type: Number, default: 0 })
  totalCount: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ActivitySummarySchema = SchemaFactory.createForClass(ActivitySummary);
