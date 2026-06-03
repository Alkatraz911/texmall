// src/home-page/dto/select-collections.dto.ts
import { IsArray, IsInt } from 'class-validator';

export class SelectCollectionsDto {
  @IsArray()
  @IsInt({ each: true })
  collectionIds: number[];
}

