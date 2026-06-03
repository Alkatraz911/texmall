import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../../models/feedback.model';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { SiteSettings } from '../../models/redirectEmail.model';
import { MailService } from './mail.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
    @InjectRepository(SiteSettings)
    private settingsRepo: Repository<SiteSettings>,
    private mailService: MailService,
  ) {}

async create(dto: CreateFeedbackDto) {
  const feedback = this.feedbackRepo.create(dto);

  try {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings?.contact_email) throw new Error('Email не настроен');

    await this.mailService.sendMail(
      settings.contact_email,
      `Новое сообщение от ${dto.name}`,
      `Имя: ${dto.name}\nEmail: ${dto.email}\nТелефон: ${dto.phone || '-'}\n\nСообщение:\n${dto.message}`
    );

    feedback.isSent = true; // успешно отправлено
  } catch (error) {
    console.error('Ошибка отправки email:', error.message);
    feedback.isSent = false; // ошибка отправки
  }

  return this.feedbackRepo.save(feedback);
}

// Новый метод для повторной отправки письма
async resendEmail(id: number) {
  const feedback = await this.feedbackRepo.findOne({ where: { id } });
  if (!feedback) throw new NotFoundException('Сообщение не найдено');

  const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
  if (!settings?.contact_email) throw new Error('Email не настроен');

  try {
    await this.mailService.sendMail(
      settings.contact_email,
      `Повторная отправка: сообщение от ${feedback.name}`,
      `Имя: ${feedback.name}\nEmail: ${feedback.email}\nТелефон: ${feedback.phone || '-'}\n\nСообщение:\n${feedback.message}`
    );
    feedback.isSent = true;
    await this.feedbackRepo.save(feedback);
    return { message: 'Письмо отправлено' };
  } catch (error) {
    console.error('Ошибка повторной отправки email:', error.message);
    throw new  NotFoundException('Ошибка отправки');
  }
}

  async findAll() {
    return this.feedbackRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const feedback = await this.feedbackRepo.findOne({ where: { id } });
    if (!feedback) throw new NotFoundException('Сообщение не найдено');
    return feedback;
  }

  async remove(id: number) {
    const result = await this.feedbackRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Сообщение не найдено');
    return { message: 'Удалено' };
  }
}
