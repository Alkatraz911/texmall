import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('admin/login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'log in method' })
  @ApiResponse({ status: 200, type: 'jwt token' })
  @Post()
  async login(@Body() userDto: CreateUserDto) {
    try {
      return await this.authService.login(userDto);
    } catch (e) {
      throw e;
    }
  }


}
