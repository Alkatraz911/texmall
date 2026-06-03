// src/home-page/home-page.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomePage } from '../../models/homepage.model';
import { HomePageController } from './homepage.controller';
import { HomePageService } from './homepage.service';
import { Collection } from '../../models/collection.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([HomePage, Collection]),
forwardRef(() => AuthModule),
],
  controllers: [HomePageController],
  providers: [HomePageService],
  exports: [HomePageService],
})
export class HomePageModule {}
