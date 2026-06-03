import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user.model';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { hash, genSalt } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.password) {
      const passHash = await hash(dto.password, await genSalt(10));
      const values = {
        ...dto,
      };
      values.password = passHash;
      const { identifiers } = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(values)
        .execute();

      return await this.findOne(identifiers[0]?.id);
    }
    return null;
  }
  

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update( dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { login: 'admin' }
    });
    const passHash = await hash(dto.password, await genSalt(10));
    user.password = passHash
    return this.userRepository.save(user);
  }

  
  // async remove(id: string): Promise<void> {
  //   const user = await this.findOne(id);
  //   await this.userRepository.remove(user);
  // }
}
