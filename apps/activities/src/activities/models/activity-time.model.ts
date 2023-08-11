import { Entity, Column } from '@dev5c32373043/nestjs-cassyllandra';

// Denormalized table for activities time to be able to fetch activities by composite cluster key
@Entity({
  table_name: 'activitiestime',
  key: ['tenantId', 'id'],
})
export class ActivityTimeEntity {
  @Column({ name: 'id', type: 'uuid', rule: { required: true } })
  id: any;

  @Column({ name: 'tenantId', type: 'uuid', rule: { required: true } })
  tenantId: any;

  @Column({
    name: 'time',
    type: 'timestamp',
    rule: { required: true },
  })
  time: Date;

  @Column({
    name: 'timeid',
    type: 'bigint',
    rule: { required: true },
  })
  timeid: any;
}
