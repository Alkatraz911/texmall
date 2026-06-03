import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, JoinTable, JoinColumn } from "typeorm";
import { Product } from "./product.model";




@Entity({name: "collection", schema: 'public'})
export class Collection {

  @PrimaryGeneratedColumn()
  id: number;
  @Column({length: 255})
  name: string;
  @Column({nullable: true, length: 1000})
  description?: string;
  @Column({nullable: true})
  featuredProductId?: number
  @OneToMany(() => Product, product => product.collection)
  products: Product[];  
}