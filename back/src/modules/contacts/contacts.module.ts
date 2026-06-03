import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactPageService } from './contacts.service';
import { ContactPageController } from './contacts.controller';
import { ContactPage } from '../../models/contact.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactPage]),
forwardRef(() => AuthModule),
],
  providers: [ContactPageService],
  controllers: [ContactPageController],
})
export class ContactPageModule {}
