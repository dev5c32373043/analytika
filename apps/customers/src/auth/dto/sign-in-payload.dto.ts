import { IsEmail, IsString, IsObject, IsNotEmpty, IsOptional, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Customer } from '../../customers/interfaces';

export class SignInData {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/) // Minimum eight characters, at least one uppercase letter and one number
  passcode: string;
}

export class SignInPayloadDto {
  @ValidateNested()
  @Type(() => SignInData)
  body: SignInData;

  @IsObject()
  @IsOptional()
  user?: Customer;
}
