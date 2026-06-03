import { Controller, Get, Post, Body, Delete, Param, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  async create(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.feedbackService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.findOne(id);
  }

  @UseGuards(AuthGuard)  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/resend')
  async resend(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.resendEmail(id);
  }
}
