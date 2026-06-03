import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {


  @IsString()
  login: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
