import { Controller, Get, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateContactEmailDto } from './dto/update-contact-email.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('contact-email')
  async getContactEmail() {
    return { contact_email: await this.settingsService.getContactEmail() };
  }
  @UseGuards(AuthGuard)
  @Put('contact-email')
  async updateContactEmail(@Body() dto: UpdateContactEmailDto) {
    return this.settingsService.setContactEmail(dto);
  }
  @UseGuards(AuthGuard)
  @Delete('contact-email')
  async deleteContactEmail() {
    return this.settingsService.deleteContactEmail();
  }
}
