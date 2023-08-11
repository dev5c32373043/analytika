import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';

export class ActivitiesListQueryDto {
  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  $token?: string;

  @IsNumberString()
  @IsOptional()
  $limit?: number;

  @IsString()
  @IsIn(['$asc', '$desc'])
  @IsOptional()
  order?: string;
}
