import {Column, Entity, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import {Length} from "class-validator";
import {Users} from "./Users.entity";
import {Materials} from "./Materials.entity";

@Entity('users_to_materials', { schema: 'public' })
@Unique(['id'])
export class UserRoles {
  @Column('integer', {
    primary: true,
    name: 'utm_id',
    default: () => '0',
  })
  id: number;

  @Column('integer', {
    name: 'utm_user_id',
  })
  userId: number;

  @ManyToOne((type) => Users, (u) => u.id)
  @JoinColumn({
    name: 'utm_user_id',
    referencedColumnName: 'id',
  })
  user: Users | any;

  @Column('integer', {
    name: 'utm_material_id',
  })
  materialId: number;

  @ManyToOne((type) => Materials, (m) => m.id)
  @JoinColumn({
    name: 'utm_material_id',
    referencedColumnName: 'id',
  })
  material: Users | any;
}
