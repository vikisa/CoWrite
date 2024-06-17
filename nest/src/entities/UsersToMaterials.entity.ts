import {Column, Entity, Unique, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Users } from './Users.entity';
import { Materials } from './Materials.entity';

@Entity('users_to_materials', { schema: 'public' })
@Unique(['id'])
export class UsersToMaterials {
  @PrimaryGeneratedColumn({
    name: 'utm_id',
  })
  id: number;

  @Column('integer', {
    name: 'utm_user_id',
  })
  userId: number;

  @ManyToOne(() => Users, (u) => u.id)
  @JoinColumn({
    name: 'utm_user_id',
    referencedColumnName: 'id',
  })
  user: Users | any;

  @Column('integer', {
    name: 'utm_material_id',
  })
  materialId: number;

  @ManyToOne(() => Materials, (m) => m.id)
  @JoinColumn({
    name: 'utm_material_id',
    referencedColumnName: 'id',
  })
  material: Materials | any;

  @Column('integer', {
    name: 'utm_date',
  })
  date: number;
}
