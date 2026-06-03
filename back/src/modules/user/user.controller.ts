import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from '../../models/user.model';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
        (async () => {
      const admin = (await this.userService.findAll()).find(
        (user) => user.login === 'admin',
      );
      if (admin) {
        return;
      } else {
        this.userService.create({
          login: 'admin',
          password: 'root'
        });
      }
    })();
  }

  // @Post()
  // create(@Body() dto: CreateUserDto): Promise<User> {
  //   return this.userService.create(dto);
  // }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put()
  changePassword( @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.update( dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<void> {
  //   return this.userService.remove(id);
  // }
}
