import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn, AfterLoad
} from "typeorm";

import { Length } from 'class-validator';

import { UserRoles } from './UserRoles.entity';

@Entity('users', { schema: 'public' })
@Unique('uq_users_id',['id'])
@Unique('uq_users_username',['username'])
@Unique('uq_users_email', ['email'])
export class Users {
  @PrimaryGeneratedColumn({
    name: 'u_id',
  })
  id: number;

  @Column('varchar', {
    name: 'u_username',
    length: 30,
  })
  @Length(0, 30)
  username: string;

  @Column('varchar', {
    name: 'u_password',
    length: 100,
  })
  @Length(0, 100)
  password: string;

  @Column('varchar', {
    name: 'u_email',
    length: 255,
  })
  @Length(0, 255)
  email: string;

  @Column('varchar', {
    name: 'u_firstname',
    length: 100,
  })
  @Length(0, 100)
  firstname: string;

  @Column('varchar', {
    name: 'u_lastname',
    nullable: true,
    length: 100,
  })
  @Length(0, 100)
  lastname: string;

  @Column('integer', {
    name: 'u_role',
    nullable: true,
    default: () => '2',
  })
  role: number | null;

  @ManyToOne((type) => UserRoles, (ur) => ur.id)
  @JoinColumn({
    name: 'u_role',
    referencedColumnName: 'id',
  })
  roles: UserRoles | any;
}