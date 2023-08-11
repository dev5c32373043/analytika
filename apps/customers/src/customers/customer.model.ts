import { Table, Model, Column, DataType, Unique, AllowNull, CreatedAt, UpdatedAt, HasOne } from 'sequelize-typescript';

import { AccessToken } from '../auth/access-token.model';

@Table
export class Customer extends Model {
  @AllowNull(false)
  @Unique('email')
  @Column
  email: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  passcode: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  apiToken: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasOne(() => AccessToken, 'customerId')
  accessToken: AccessToken;
}
