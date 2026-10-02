// backend/src/tools/dto/create-tool.dto.ts

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ToolCategory } from '../../generated/prisma/enums';

export class CreateToolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsEnum(ToolCategory)
  category!: ToolCategory;
}