import { IsNumberString, IsOptional, IsString, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Query {
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

export class ListPayloadDto {
  @ValidateNested()
  @Type(() => Query)
  query: Query;

  @IsString()
  tenantId: string;
}
