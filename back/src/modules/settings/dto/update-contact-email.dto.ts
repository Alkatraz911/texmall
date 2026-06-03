import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateContactEmailDto {
  @IsEmail()
  @IsNotEmpty()
  contact_email: string;
}
