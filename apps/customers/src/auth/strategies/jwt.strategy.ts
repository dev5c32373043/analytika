import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';

import { Customer } from '../../customers/interfaces';

export interface CustomerFromJwt extends Omit<Customer, 'id'> {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.secret'),
    });
  }

  async validate(payload: CustomerFromJwt) {
    const isTokenValid = await this.authService.validateAccessToken(payload.sub);
    if (!isTokenValid) {
      throw new RpcException({ message: 'Please check your login credentials', status: 401 });
    }

    return { id: payload.sub, email: payload.email, name: payload.name, apiToken: payload.apiToken };
  }
}
