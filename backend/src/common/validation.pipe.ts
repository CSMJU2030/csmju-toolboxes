// backend/src/common/validation.pipe.ts
// validation ล้ม = 400 VALIDATION_ERROR และ error.details เป็น array ของข้อความ

import {
  BadRequestException,
  ValidationPipe,
  type ValidationError,
  type ValidationPipeOptions,
} from '@nestjs/common';

function flatten(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(...flatten(error.children));
    }
  }
  return messages;
}

const validationOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: flatten(errors),
    }),
};

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super(validationOptions);
  }
}