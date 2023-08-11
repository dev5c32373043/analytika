import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';

import confSetup from './config/setup';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [confSetup], isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('db'),
        dialect: 'postgres',
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    CustomersModule,
    AuthModule,
  ],
  providers: [ConfigService],
  controllers: [AuthController],
})
export class RootModule {}
