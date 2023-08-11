import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

import { AccessToken } from './access-token.model';

import { CustomerService } from '../customers/customer.service';

import { Customer } from '../customers/interfaces';

import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(AccessToken)
    private accessTokenModel: typeof AccessToken,
    private sequelize: Sequelize,
  ) {}

  async signIn(customer: Customer) {
    const { id, email, name } = customer;
    const accessToken = await this.refreshAccessToken(customer);
    return { id, email, name, accessToken: accessToken.value };
  }

  async signUp(email: string, name: string, passcode: string): Promise<any> {
    const customer = await this.customerService.findOne({ email });
    if (customer) {
      throw new RpcException({ message: 'Email already in use!', status: 400 });
    }

    const newCustomer = { email, name, passcode: '' };
    newCustomer.passcode = await bcrypt.hash(passcode, this.configService.get('jwt.salt'));
    const createdCustomer = (await this.customerService.create(newCustomer)).get({ plain: true });

    return this.signIn(createdCustomer);
  }

  async validateCustomer(email: string, passcode: string): Promise<any> {
    const customer = await this.customerService.findOne({ email });
    if (!customer) return null;

    const isPasscodeMatches = await bcrypt.compare(passcode, customer.passcode);
    if (!isPasscodeMatches) return null;

    return { ...customer.toJSON(), passcode: undefined };
  }

  async validateApiToken(apiToken: string): Promise<boolean> {
    const customer = await this.customerService.findOne({ apiToken });
    return customer != null;
  }

  async validateAccessToken(customerId: number): Promise<boolean> {
    const token = await this.accessTokenModel.findOne({ where: { customerId }, attributes: ['id'], raw: true });
    return token != null;
  }

  async refreshAccessToken(customer: Customer) {
    const { id, email, name, apiToken } = customer;
    const payload = { email, name, apiToken, sub: id };
    const accessTokenValue = await this.jwtService.signAsync(payload);

    return this.sequelize.transaction(async transaction => {
      await this.removeAccessToken(id, transaction);
      const newAccessToken = await this.accessTokenModel.create(
        { value: accessTokenValue, customerId: id },
        { transaction },
      );

      return newAccessToken.get({ plain: true });
    });
  }

  async removeAccessToken(customerId: number, transaction?: Transaction) {
    const extraOptions = transaction != null ? { transaction } : {};
    await this.accessTokenModel.destroy({ where: { customerId }, ...extraOptions });
  }
}
