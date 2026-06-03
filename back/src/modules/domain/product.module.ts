import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../models/product.model';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Collection } from '../../models/collection.model';
import { AuthModule } from '../auth/auth.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Collection]),
  forwardRef(() => AuthModule),
  //  ServeStaticModule.forRoot({
  //     rootPath: join(process.cwd(), 'uploads'),
  //     serveRoot: '/uploads', // например, доступ по /uploads/...
  //   }),
],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
