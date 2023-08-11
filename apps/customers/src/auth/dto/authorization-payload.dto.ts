import { IsString, IsObject, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Customer } from '../../customers/interfaces';

export class AuthorizationData {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class AuthorizationPayloadDto {
  @ValidateNested()
  @Type(() => AuthorizationData)
  body: AuthorizationData;

  @IsObject()
  @IsOptional()
  user?: Customer;
}
