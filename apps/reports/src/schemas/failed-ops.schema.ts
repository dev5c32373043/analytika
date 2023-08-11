import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FailedOpsDocument = HydratedDocument<FailedOps>;

@Schema()
export class FailedOps {
  @Prop({ required: true })
  model: string;

  @Prop({ type: Array, required: true })
  ops: any[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const FailedOpsSchema = SchemaFactory.createForClass(FailedOps);
