import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Collection } from "./collection.model";



@Entity({ name: 'Product', schema: 'public' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column('text', { array: true, default: [] })
  videos: string[];

  @Column({ default: 0 })
  sortOrder: number;

  @Column({default: ''})
  type?: string;

  @Column({default: ''})
  resistance?: string;

  @Column({default: ''})

  density?: string;

  @Column({default: ''})
  width?: string;

  @ManyToOne(() => Collection, (collection) => collection.products, { onDelete: 'CASCADE' })
  collection: Collection;

}