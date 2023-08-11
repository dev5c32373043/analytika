import { Entity, Column } from '@dev5c32373043/nestjs-cassyllandra';

// Counter table for activities to generate unique timeid
@Entity({
  table_name: 'activitiescounter',
  key: ['tenantId'],
})
export class ActivityOrderEntity {
  @Column({ name: 'tenantId', type: 'uuid', rule: { required: true } })
  tenantId: any;

  @Column({
    name: 'value',
    type: 'counter',
    rule: { required: true },
  })
  value: any;
}
