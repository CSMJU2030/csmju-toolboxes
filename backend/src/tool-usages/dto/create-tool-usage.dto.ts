// backend/src/tool-usages/dto/create-tool-usage.dto.ts

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ToolUsageStatus } from '../../generated/prisma/enums';

export class CreateToolUsageDto {
  @IsString()
  @IsNotEmpty()
  toolId!: string;

  @IsEnum(ToolUsageStatus)
  status!: ToolUsageStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  inputSizeBytes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  outputSizeBytes?: number;
}