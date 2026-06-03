import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './middlewares/loggingInterceptor';
import { UsersModule } from './modules/user/user.module';
import { ProductModule } from './modules/domain/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ContactPageModule } from './modules/contacts/contacts.module';
import { HomePageModule } from './modules/homepage/homepage.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { SettingsModule } from './modules/settings/settings.module';



@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [typeorm]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    }),
        ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads', // например, доступ по /uploads/...
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    ContactPageModule,
    HomePageModule,
    FeedbackModule,
    SettingsModule,
  ],

  
})
export class AppModule {}
