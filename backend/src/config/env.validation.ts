// backend/src/config/env.validation.ts

import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

class EnvironmentVariables {
  @IsOptional()
  @IsString()
  NODE_ENV?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @IsOptional()
  @IsString()
  SUBSYSTEM_ID?: string;

  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  CORE_HUB_URL?: string;

  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  CORE_HUB_JWKS_URL?: string;

  @IsOptional()
  @IsString()
  DATABASE_URL?: string;

  @IsOptional()
  @IsIn([
    'student',
    'alumni',
    'staff',
    'lecturer',
    'guest',
    'admin',
  ])
  CORE_ROLE?: string;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const validatedConfig =
    plainToInstance(
      EnvironmentVariables,
      config,
      {
        enableImplicitConversion: true,
      },
    );

  const errors = validateSync(
    validatedConfig,
    {
      skipMissingProperties: true,
    },
  );

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed: ${errors
        .map((error) =>
          Object.values(
            error.constraints ?? {},
          ).join(', '),
        )
        .join('; ')}`,
    );
  }

  return config;
}