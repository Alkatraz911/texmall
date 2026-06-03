// src/home-page/home-page.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HomePageService } from './homepage.service';
import { UpdateHomePageDto } from './dto/update-home-page.dto';
import { SelectCollectionsDto } from './dto/select-collections.dto';
import { HomePage } from '../../models/homepage.model';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { unlink } from 'fs/promises';
import { AuthGuard } from '../auth/auth.guard';

@Controller('home-page')
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  // Получить данные главной страницы
  @Get()
  async getHomePage(): Promise<HomePage> {
    return this.homePageService.getHomePage();
  }

  // Обновить текстовое содержимое (title, subtitle, описание и т.д.)
  @UseGuards(AuthGuard)
  @Put()
  async updateHomePage(@Body() dto: UpdateHomePageDto): Promise<HomePage> {
    return this.homePageService.updateHomePage(dto);
  }

  // Загрузить видео для hero секции
  @UseGuards(AuthGuard)
  @Post('upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/homepage', // папка для хранения
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          return cb(new NotFoundException('Разрешены только видеофайлы'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) throw new NotFoundException('Файл не загружен');
    const filePath = join('uploads/homepage', file.filename);
    const page = await this.homePageService.getHomePage();
    page.heroVideo = `/${filePath}`;
    await this.homePageService.updateHomePage(page);
    return { url: `/${filePath}` };
  }

  // Установить популярные коллекции
  @UseGuards(AuthGuard)
  @Put('popular-collections')
  async setPopularCollections(@Body() dto: SelectCollectionsDto): Promise<HomePage> {
    return this.homePageService.setPopularCollections(dto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-video')
    async deleteHeroVideo(): Promise<{ message: string }> {
    const page = await this.homePageService.getHomePage();
    if (!page.heroVideo) {
      throw new NotFoundException('Видео не найдено');
    }

    // Получаем путь к файлу на диске
    const filePath = join(process.cwd(), page.heroVideo.replace('/', ''));
    
    // Удаляем файл с диска
    try {
      await unlink(filePath);
    } catch (err) {
      console.warn('Не удалось удалить файл с диска', err);
      // Можно не падать, если файла уже нет
    }

    // Обнуляем поле heroVideo в базе
    page.heroVideo = '';
    await this.homePageService.updateHomePage(page);

    return { message: 'Видео удалено' };
  }

}

