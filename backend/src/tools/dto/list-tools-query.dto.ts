// backend/src/tools/dto/list-tools-query.dto.ts

import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ToolCategory } from '../../generated/prisma/enums';

export class ListToolsQueryDto {
  @IsOptional()
  @IsEnum(ToolCategory)
  category?: ToolCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
