// src/home-page/entities/home-page.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Collection } from './collection.model';

@Entity('home_page')
export class HomePage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Ткани, в которые влюбляешься' })
  heroTitle: string;

  @Column({ default: 'Откройте для себя мир качественных тканей для создания уникальных изделий' })
  heroSubtitle: string;

  @Column({ default: '/videos/fabric-demo.mp4' })
  heroVideo: string;

  @Column('json', { default: [] })
  advantages: { title: string; description: string; icon: string }[];

  @ManyToMany(() => Collection)
  @JoinTable()
  popularCollections: Collection[];
}
