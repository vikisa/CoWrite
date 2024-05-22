import {Column, Entity, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import {Length} from "class-validator";
import {Users} from "./Users.entity";
import {Materials} from "./Materials.entity";

@Entity('comments', { schema: 'public' })
@Unique(['id'])
export class UserRoles {
  @Column('integer', {
    primary: true,
    name: 'c_id',
    default: () => '0',
  })
  id: number;

  @Column('integer', {
    name: 'c_user_id',
  })
  userId: number;

  @ManyToOne((type) => Users, (u) => u.id)
  @JoinColumn({
    name: 'c_user_id',
    referencedColumnName: 'id',
  })
  user: Users | any;

  @Column('integer', {
    name: 'c_material_id',
  })
  materialId: number;

  @ManyToOne((type) => Materials, (m) => m.id)
  @JoinColumn({
    name: 'c_material_id',
    referencedColumnName: 'id',
  })
  material: Materials | any;

  @Column('text', {
    name: 'c_text',
  })
  text: string;

  @Column('varying character', {
    name: 'c_block_id',
    nullable: true,
    length: 10,
    default: () => "''",
  })
  blockId: string
}
