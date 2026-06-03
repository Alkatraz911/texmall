import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactPage } from '../../models/contact.model';

@Injectable()
export class ContactPageService {
  constructor(
    @InjectRepository(ContactPage)
    private contactPageRepository: Repository<ContactPage>,
  ) {}

  findOne(): Promise<ContactPage> {
    return this.contactPageRepository.findOne({ where: {} });
  }

  async update(data: Partial<ContactPage>): Promise<ContactPage> {
    let page = await this.findOne();
    if (!page) {
      page = this.contactPageRepository.create(data);
    } else {
      Object.assign(page, data);
    }
    return this.contactPageRepository.save(page);
  }

  
  // Метод для создания заглушки при пустой базе
  async seed(): Promise<void> {
    const existing = await this.findOne();
    if (!existing) {
      const defaultPage = this.contactPageRepository.create({
        city1: 'Ростов-на-Дону',
        address1: 'ул. Текучева, д. 209 "В"',
        phone1: '+7 (911) 899-88-22, +7 (911) 899-87-35',
        email1: 'zakaz.rostov@tex-mall.ru',
        city2: 'Ульяновск',
        address2: 'проезд Инженерный 8, д.9B/1б',
        phone2: '+7 (911) 899-90-30, +7 (911) 899-86-96',
        email2: 'zakaz.ulyanovsk@tex-mall.ru',
      });
      await this.contactPageRepository.save(defaultPage);
    }
  }
}

