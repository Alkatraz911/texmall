import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinColumn } from 'typeorm'

@Entity({ name: 'users', schema: "public" })
class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, default: 'login', unique: true })
  login: string;

  @Column({ length: 255, unique: true })
  password: string;


}
export { User };