import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../../models/redirectEmail.model';
import { UpdateContactEmailDto } from './dto/update-contact-email.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private settingsRepo: Repository<SiteSettings>,
  ) {}

  async getContactEmail(): Promise<string | null> {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    return settings?.contact_email || null;
  }

  async setContactEmail(dto: UpdateContactEmailDto) {
    let settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.settingsRepo.create({ id: 1, contact_email: dto.contact_email });
    } else {
      settings.contact_email = dto.contact_email;
    }
    await this.settingsRepo.save(settings);
    return settings;
  }

  async deleteContactEmail() {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings) throw new NotFoundException('Настройки не найдены');
    settings.contact_email = null;
    await this.settingsRepo.save(settings);
    return { message: 'Email удалён' };
  }
}
