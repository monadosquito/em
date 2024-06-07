import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProblematicUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  lastName: string

  @Column({ nullable: false })
  age: number

  @Column({ default: true })
  problems: boolean
}
