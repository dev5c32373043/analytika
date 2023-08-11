import { IsNumber, IsObject, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Customer } from '../../customers/interfaces';

export class LogoutData {
  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}

export class LogoutPayloadDto {
  @ValidateNested()
  @Type(() => LogoutData)
  body: LogoutData;

  @IsObject()
  @IsOptional()
  user?: Customer;
}
