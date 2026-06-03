import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contact_page')
export class ContactPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar'})
  city1: string;

  @Column({ type: 'text'})
  address1: string;

  @Column({ type: 'varchar'})
  phone1: string | string[];

  @Column({ type: 'varchar'})
  email1: string;

  @Column({ type: 'varchar'})
  city2: string;

  @Column({ type: 'text'})
  address2: string;

  @Column({ type: 'varchar'})
  phone2: string | string[];

  @Column({ type: 'varchar'})
  email2: string;

}
