// backend/src/tool-usages/dto/list-tool-usages-query.dto.ts

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ToolUsageStatus } from '../../generated/prisma/enums';

export class ListToolUsagesQueryDto {
  @IsOptional()
  @IsString()
  toolId?: string;

  @IsOptional()
  @IsEnum(ToolUsageStatus)
  status?: ToolUsageStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}