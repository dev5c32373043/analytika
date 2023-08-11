import { Entity, Column, CreateDateColumn } from '@dev5c32373043/nestjs-cassyllandra';

@Entity({
  table_name: 'tenants',
  key: ['id'],
})
export class TenantEntity {
  @Column({
    type: 'uuid',
    rule: {
      required: true,
    },
  })
  id: any;

  @CreateDateColumn()
  createdAt: Date;
}
