import { Table, Model, Column, AllowNull, CreatedAt, BelongsTo, DataType } from 'sequelize-typescript';

import { Customer } from '../customers/customer.model';

@Table
export class AccessToken extends Model {
  @AllowNull(false)
  @Column(DataType.TEXT)
  value: string;

  @CreatedAt
  createdAt: Date;

  @BelongsTo(() => Customer, 'customerId')
  customer: Customer;
}
