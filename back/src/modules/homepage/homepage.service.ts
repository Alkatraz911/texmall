// src/home-page/home-page.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { HomePage } from '../../models/homepage.model';
import { UpdateHomePageDto } from './dto/update-home-page.dto';
import { SelectCollectionsDto } from './dto/select-collections.dto';
import { Collection } from '../../models/collection.model';

@Injectable()
export class HomePageService {
  constructor(
    @InjectRepository(HomePage)
    private readonly homePageRepository: Repository<HomePage>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

async getHomePage(): Promise<HomePage> {
  // Попытка найти запись с id = 1
let page = await this.homePageRepository.findOne({
  where: { id: 1 },
  loadRelationIds: {
    relations: ['popularCollections'], // массив внутри объекта
  },
});

  // Если записи нет — создаём её автоматически
  if (!page) {
    page = this.homePageRepository.create({
      heroTitle: 'Добро пожаловать!',
      heroSubtitle: 'Настройте главную страницу',
      heroVideo: '',
      popularCollections: [],
    });
    await this.homePageRepository.save(page);
  }
  return page;
}


  async updateHomePage(dto: UpdateHomePageDto): Promise<HomePage> {
    const page = await this.getHomePage();
    Object.assign(page, dto);
    return this.homePageRepository.save(page);
  }

  async setPopularCollections(dto: SelectCollectionsDto): Promise<HomePage> {
    const page = await this.getHomePage();
    const collections = await this.collectionRepository.find({
      where: { id: In(dto.collectionIds) },
    });
    page.popularCollections = collections;
    return this.homePageRepository.save(page);
  }
}
