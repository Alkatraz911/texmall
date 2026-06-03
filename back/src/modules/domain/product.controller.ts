import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors, Res, Req, NotFoundException,
  UseGuards
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto, UpdateProductDto,
  CreateCollectionDto, UpdateCollectionDto
} from './dto/product.dto';
import { Product } from '../../models/product.model';
import { Collection } from '../../models/collection.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { createReadStream, statSync, existsSync } from 'fs';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // -------- Products --------
  @UseGuards(AuthGuard)
  @Post('products')
  createProduct(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @Get('products')
  findAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('products/:id')
  findOneProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('products/:id')
  removeProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }

  // -------- Загрузка фото --------
  @UseGuards(AuthGuard)
  @Post('products/:id/upload/images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/products/images',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid image type'), false);
        }
      },
    }),
  )
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    return this.productService.addImages(id, files);
  }

  // -------- Загрузка видео --------
  @UseGuards(AuthGuard)
  @Post('products/:id/upload/videos')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads/products/videos',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(mp4|avi|mov|mkv)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid video type'), false);
        }
      },
    }),
  )
  async uploadVideos(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    return this.productService.addVideos(id, files);
  }

  // -------- Получение изображений --------
  @Get('products/images/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'uploads',
      'products',
      'images',
      filename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    return res.sendFile(filePath);
  }

  // -------- Получение видео (стриминг) --------
  @Get(':id/videos/:filename')
  async getVideo(
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const filePath = join(
      process.cwd(),
      'uploads',
      'products',
      'videos',
      filename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException('Video not found');
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;
    const rangeHeader = req.headers['range'];
    const range = Array.isArray(rangeHeader) ? rangeHeader[0] : rangeHeader;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4', // можно динамически подставить
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      createReadStream(filePath).pipe(res);
    }
  }
  @UseGuards(AuthGuard)
  @Delete('products/:id/images')
  async deleteImage(
    @Param('id') id: number,
    @Body('filename') filename: string,
  ) {
    return this.productService.deleteImage(id, filename);
  }
  @UseGuards(AuthGuard)
  @Delete('products/:id/videos')
  async deleteVideo(
    @Param('id') id: number,
    @Body('filename') filename: string,
  ) {
    return this.productService.deleteVideo(id, filename);
  }

  // -------- Collections --------
  @UseGuards(AuthGuard)
  @Post('collections')
  createCollection(@Body() dto: CreateCollectionDto): Promise<Collection> {
    return this.productService.createCollection(dto);
  }

  @Get('collections')
  findAllCollections(): Promise<Collection[]> {
    return this.productService.findAllCollections();
  }

  @Get('collections/:id')
  findCollectionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Collection> {
    return this.productService.findCollectionById(id);
  }
  @UseGuards(AuthGuard)
  @Put('collections/:id')
  updateCollection(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCollectionDto,
  ): Promise<Collection> {
    return this.productService.updateCollection(id, dto);
  }
  @UseGuards(AuthGuard)
  @Delete('collections/:id')
  removeCollection(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.removeCollection(id);
  }
}
