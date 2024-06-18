import { Column, Entity, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users.entity';

@Entity('materials', { schema: 'public' })
@Unique(['id'])
export class Materials {
  @PrimaryGeneratedColumn({
    name: 'm_id',
  })
  id: number;

  @Column('integer', {
    name: 'm_create_date',
    nullable: true,
  })
  createDate: number;

  @Column('integer', {
    name: 'm_save_date',
    default: 0,
  })
  saveDate: number;

  @Column('text', {
    name: 'm_text',
  })
  text: string;

  @Column('character varying', {
    name: 'm_header',
    nullable: true,
    length: 250,
    default: () => "''",
  })
  header: string | null;

  @Column('integer', {
    name: 'm_creator_id',
  })
  creatorId: number;

  @ManyToOne(() => Users, (u) => u.id)
  @JoinColumn({
    name: 'm_creator_id',
    referencedColumnName: 'id',
  })
  creator: Users | any;

  @Column('character varying', {
    name: 'm_editing_id',
    length: 16,
    default: () => "''",
  })
  editingId: string | null;
}
