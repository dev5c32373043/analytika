import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SequelizeModule } from '@nestjs/sequelize';
import { AccessToken } from './access-token.model';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    ConfigModule,
    CustomersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '30days' },
      }),
    }),
    SequelizeModule.forFeature([AccessToken]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [ConfigService, AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
