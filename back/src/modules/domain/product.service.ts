import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ViewColumn } from 'typeorm';
import { Product } from '../../models/product.model';
import {
  CreateProductDto, UpdateProductDto,
  CreateCollectionDto, UpdateCollectionDto
} from './dto/product.dto';
import { Collection } from '../../models/collection.model';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  // -------- Product CRUD --------
  async create(dto: CreateProductDto): Promise<Product> {
    const collection = await this.collectionRepository.findOneBy({
      id: dto.collection,
    });
 

    if (!collection) throw new NotFoundException('Collection not found');
   

    const product = this.productRepository.create({
      ...dto,
      collection,
      images: dto.images ?? [],
    });

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['collection'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['collection'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.collection) {
      const collection = await this.collectionRepository.findOneBy({
        id: dto.collection,
      });
      if (!collection) throw new NotFoundException('Collection not found');
      product.collection = collection;
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // Метод для добавления файлов (фото/видео) к продукту
  async addImages(id: number, files: Express.Multer.File[]): Promise<Product> {
    try {
      const product = await this.findOne(id);
      const newFiles = files.map(
        (f) => `/uploads/products/images/${f.filename}`,
      );
      product.images = [...(product.images || []), ...newFiles];
      return this.productRepository.save(product);
    } catch (e) {
      throw e;
    }
  }

  async addVideos(id: number, files: Express.Multer.File[]): Promise<Product> {
    const product = await this.findOne(id);
    const newFiles = files.map((f) => `/uploads/products/videos/${f.filename}`);
    product.videos = [...(product.videos || []), ...newFiles];
    return this.productRepository.save(product);
  }

  // ---------------- Удаление изображений ----------------
  async deleteImage(productId: number, filename: string): Promise<Product> {
    const product = await this.findOne(productId);
    if (!product.images?.includes(filename)) {
      throw new NotFoundException('Изображение не найдено');
    }

    // Удаляем файл с диска
    const filePath = join(process.cwd(), filename.replace(/^\//, ''));
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn('Не удалось удалить файл с диска', err);
    }

    // Обновляем массив изображений
    product.images = product.images.filter((img) => img !== filename);
    return this.productRepository.save(product);
  }

  // ---------------- Удаление видео ----------------
  async deleteVideo(productId: number, filename: string): Promise<Product> {
    const product = await this.findOne(productId);
    if (!product.videos?.includes(filename)) {
      throw new NotFoundException('Видео не найдено');
    }

    // Удаляем файл с диска
    const filePath = join(process.cwd(), filename.replace(/^\//, ''));
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn('Не удалось удалить файл с диска', err);
    }

    // Обновляем массив видео
    product.videos = product.videos.filter((v) => v !== filename);
    return this.productRepository.save(product);
  }


  // -------- Collection CRUD --------
  async createCollection(dto: CreateCollectionDto): Promise<Collection> {
    const collection = this.collectionRepository.create(dto);
    return this.collectionRepository.save(collection);
  }

  findAllCollections(): Promise<Collection[]> {
    return this.collectionRepository.find({ relations: ['products'] });
  }

  async findCollectionById(id: number): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async updateCollection(
    id: number,
    dto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.collectionRepository.findOneBy({ id });
    if (!collection) throw new NotFoundException('Collection not found');
    Object.assign(collection, dto);
    return this.collectionRepository.save(collection);
  }

  async removeCollection(id: number): Promise<void> {
    const collection = await this.collectionRepository.findOneBy({ id });
    if (!collection) throw new NotFoundException('Collection not found');
    await this.collectionRepository.remove(collection);
  }
}
