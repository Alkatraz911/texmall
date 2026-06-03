import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  contact_email: string;
}
