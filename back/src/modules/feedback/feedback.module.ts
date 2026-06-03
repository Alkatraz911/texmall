import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from '../../models/feedback.model';
import { SiteSettings } from '../../models/redirectEmail.model';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MailService } from './mail.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, SiteSettings]), 
  forwardRef(()=> AuthModule)
],
  controllers: [FeedbackController],
  providers: [FeedbackService, MailService],
})
export class FeedbackModule {}
