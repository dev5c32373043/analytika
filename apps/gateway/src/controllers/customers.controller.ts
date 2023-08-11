import {
  Controller,
  Req,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';

import { CustomersService } from '../services/customers.service';

import { to } from '../utils';

import { CustomerSignInBodyDto, CustomerSignUpBodyDto } from '../dto';

@Controller('/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('/auth/sign-in')
  @HttpCode(200)
  async signIn(@Body() payload: CustomerSignInBodyDto) {
    const [err, response] = await to(this.customersService.signIn(payload));
    if (err) {
      throw new HttpException({ message: err.message }, HttpStatus.UNAUTHORIZED);
    }

    return response.data;
  }

  @Post('/auth/sign-up')
  async signUp(@Body() payload: CustomerSignUpBodyDto) {
    const [err, response] = await to(this.customersService.signUp(payload));
    if (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }

    return response.data;
  }

  @UseGuards(AuthGuard)
  @Delete('/auth/logout')
  logout(@Req() req) {
    return this.customersService.logout(req.customer.id);
  }

  @UseGuards(AuthGuard)
  @Get('/profile/api-token')
  getApiToken(@Req() req) {
    return { value: req.customer.apiToken };
  }
}
