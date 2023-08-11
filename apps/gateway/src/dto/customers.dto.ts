import { IsEmail, IsString, IsNotEmpty, Matches } from 'class-validator';

export class CustomerSignInBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'passcode should be at least 8 characters, at least one uppercase letter and one number',
  })
  passcode: string;
}

export class CustomerSignUpBodyDto extends CustomerSignInBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
