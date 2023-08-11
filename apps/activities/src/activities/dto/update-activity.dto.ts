import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateActivityDto {
  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsNumber()
  @IsOptional()
  value?: number;
}
