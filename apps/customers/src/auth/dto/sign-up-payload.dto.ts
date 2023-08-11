import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SignInData } from './sign-in-payload.dto';

export class SignUpData extends SignInData {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SignUpPayloadDto {
  @ValidateNested()
  @Type(() => SignUpData)
  body: SignUpData;
}
