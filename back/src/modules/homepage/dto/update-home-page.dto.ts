// src/home-page/dto/update-home-page.dto.ts
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateHomePageDto {
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  heroVideo?: string;

  @IsOptional()
  @IsArray()
  advantages?: { title: string; description: string; icon: string }[];
}
