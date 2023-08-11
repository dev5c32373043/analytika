import {
  Entity,
  Column,
  GeneratedUUidColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from '@dev5c32373043/nestjs-cassyllandra';

@Entity({
  table_name: 'activities',
  key: [['tenantId'], 'timeid', 'time', 'id'],
  clustering_order: { timeid: 'desc' },
})
export class ActivityEntity {
  @GeneratedUUidColumn()
  id: any;

  @Column({ name: 'tenantId', type: 'uuid', rule: { required: true } })
  tenantId: any;

  @Column({
    name: 'action',
    type: 'text',
    rule: {
      required: true,
    },
  })
  action: string;

  @Column({
    name: 'time',
    type: 'timestamp',
    default: { $db_function: 'toTimestamp(now())' },
  })
  time: Date;

  @Column({
    name: 'timeid',
    type: 'bigint',
    rule: {
      required: true,
    },
  })
  timeid: any;

  @Column({
    name: 'username',
    type: 'text',
    rule: {
      required: true,
    },
  })
  username: string;

  @Column({
    name: 'value',
    type: 'float',
    default: '1',
  })
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  __v: string;
}
