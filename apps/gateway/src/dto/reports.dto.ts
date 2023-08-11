import { IsString, IsOptional } from 'class-validator';

export class ActivityTimelineReportQueryDto {
  @IsOptional()
  @IsString()
  action?: string;
}
