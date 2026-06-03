import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettings } from '../../models/redirectEmail.model';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings]),
forwardRef(() => AuthModule)
],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
