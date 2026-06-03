import { IsString, IsOptional, IsArray, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// ---------- Product DTO ----------



export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional({ type: [String], description: 'Массив ссылок на картинки' })
  images?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Массив ссылок на видео' })
  videos?: string[];

  @ApiPropertyOptional()
  sortOrder?: number;

  @ApiProperty()
  collection: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  resistance: string;

  @ApiProperty()
  density: string;

  @ApiProperty()
  width: string;
}


export class UpdateProductDto {
 
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  videos?: string[];

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  collection: number;
  @IsOptional()
  type: string;

  @IsOptional()
  resistance: string;

  @IsOptional()
  density: string;

  @IsOptional()
  width: string;
}


// ---------- Collection DTO ----------
export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  featuredProductId?: number;
  
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  featuredProductId?: number;
}
