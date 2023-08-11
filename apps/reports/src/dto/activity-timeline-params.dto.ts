import { IsString, IsOptional } from 'class-validator';

export class ActivityTimelineParamsDto {
  @IsString()
  tenantId: string;

  @IsOptional()
  @IsString()
  action?: string;
}
