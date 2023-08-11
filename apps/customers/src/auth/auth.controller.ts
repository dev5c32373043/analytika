import { Controller, UseGuards, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { SignInPayloadDto, SignUpPayloadDto, AuthorizationPayloadDto, LogoutPayloadDto } from './dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern('auth.sign_in')
  async signIn(req: SignInPayloadDto) {
    const result = await this.authService.signIn(req.user);
    return { status: HttpStatus.OK, data: result };
  }

  @MessagePattern('auth.sign_up')
  async signUp(req: SignUpPayloadDto) {
    const { email, name, passcode } = req.body;
    const result = await this.authService.signUp(email, name, passcode);
    return { status: HttpStatus.OK, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('auth.authorize')
  async authorize(req: AuthorizationPayloadDto) {
    return { status: HttpStatus.OK, data: req.user };
  }

  @MessagePattern('auth.authorize_api_token')
  async authorizeApiToken(token: string) {
    const isAuthorized = await this.authService.validateApiToken(token);
    if (!isAuthorized) {
      throw new RpcException({ status: HttpStatus.UNAUTHORIZED });
    }

    return { status: HttpStatus.OK };
  }

  @MessagePattern('auth.logout')
  async logout(req: LogoutPayloadDto) {
    const { customerId } = req.body;

    await this.authService.removeAccessToken(customerId);

    return { status: HttpStatus.OK };
  }
}
