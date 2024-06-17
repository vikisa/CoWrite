import {Column, Entity, PrimaryGeneratedColumn, Unique, OneToOne, JoinColumn} from "typeorm";
import {Length} from "class-validator";

@Entity('user_roles', { schema: 'public' })
@Unique(['id'])
export class UserRoles {
  @Column('integer', {
    primary: true,
    name: 'ur_id',
    default: () => '0',
  })
  id: number;

  @Column('varchar', {
    name: 'ur_title',
    length: 50,
  })
  @Length(0, 50)
  roleTitle: string;
}
