
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import 'reflect-metadata';
import { AllExceptionsFilter } from './helpers/AllExceptionsFilter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ContactPageService } from './modules/contacts/contacts.service';

async function bootstrap() {
  let app;
  let mode;
  if (process.env.USE_FASTIFY === 'true') {
    mode = 'fastify';
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
  } else {
    mode = 'express';
    app = await NestFactory.create(AppModule);
  }
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin: true});
  // app.useGlobalFilters(new AllExceptionsFilter(app));

    // Сеeding
  const contactService = app.get(ContactPageService);
  await contactService.seed();
  
  // Swagger конфигурация
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API для управления продуктами, коллекциями, пользователями')
    .setVersion('1.0')
    .addBearerAuth() // если будет авторизация
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // UI будет на /swagger

  await app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`App is running at ${process.env.PORT} port. App mode ${mode}`);
  });
}
bootstrap();
