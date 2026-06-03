import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContactPageService } from './contacts.service';
import { ContactPage } from '../../models/contact.model';
import { AuthGuard } from '../auth/auth.guard';

@Controller('contact-page')
export class ContactPageController {
  constructor(private readonly service: ContactPageService) {}

  @Get()
  getPage(): Promise<ContactPage> {
    return this.service.findOne();
  }

  @UseGuards(AuthGuard)
  @Put()
  updatePage(@Body() data: Partial<ContactPage>): Promise<ContactPage> {
    return this.service.update(data);
  }
}
