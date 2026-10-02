// backend/src/common/exception.filter.ts
// แปลงทุก error เป็น envelope { success:false, error:{ code, message, details? } }
// - code อยู่ใน enum ปิด 9 ค่าเท่านั้น (common/error-codes.ts)
// - 429 / 503 ใส่ header Retry-After (วินาที ≥ 1)
// - ไม่ส่ง stack trace / path ไฟล์ / ข้อความ ORM ออกไปใน response
// - log เฉพาะ request.path (ไม่มี query) — ห้ามใช้ request.url

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { errorResponse } from './api-response';
import { isErrorCode, type ErrorCode } from './error-codes';

const DEFAULT_RETRY_AFTER_SECONDS = 5;

interface Mapped {
  status: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
}

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const mapped =
      exception instanceof HttpException
        ? this.fromHttpException(exception)
        : this.fromUnknown(exception);

    if (mapped.status >= 500) {
      this.logger.error(
        JSON.stringify({
          event: 'http.error',
          status: mapped.status,
          code: mapped.code,
          path: request.path,
        }),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    if (mapped.status === 429 || mapped.status === 503) {
      response.setHeader(
        'Retry-After',
        String(this.retryAfterSeconds(exception)),
      );
    }

    response
      .status(mapped.status)
      .json(errorResponse(mapped.code, mapped.message, mapped.details));
  }

  private fromHttpException(exception: HttpException): Mapped {
    const status = exception.getStatus();
    const body = exception.getResponse();

    let message = exception.message;
    let details: unknown;
    let explicitCode: unknown;

    if (typeof body === 'string') {
      message = body;
    } else if (body && typeof body === 'object') {
      const record = body as Record<string, unknown>;
      explicitCode = record.code;
      details = record.details;
      if (typeof record.message === 'string') {
        message = record.message;
      } else if (Array.isArray(record.message)) {
        // ValidationPipe เดิมของ Nest: message เป็น array
        message = 'Request validation failed';
        details = record.message;
        explicitCode = 'VALIDATION_ERROR';
      }
    }

    const code = isErrorCode(explicitCode)
      ? explicitCode
      : this.codeFromStatus(status);

    return { status, code, message, details };
  }

  private fromUnknown(exception: unknown): Mapped {
    const prismaCode = this.prismaErrorCode(exception);

    if (prismaCode === 'P2024') {
      // connection pool เต็ม = พึ่งพาไม่พร้อมชั่วคราว
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
      };
    }
    if (prismaCode === 'P2002') {
      return {
        status: HttpStatus.CONFLICT,
        code: 'CONFLICT',
        message: 'Resource already exists',
      };
    }
    if (prismaCode === 'P2025') {
      return {
        status: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND',
        message: 'Resource not found',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    };
  }

  private codeFromStatus(status: number): ErrorCode {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST';
    }
  }

  private prismaErrorCode(exception: unknown): string | undefined {
    if (typeof exception !== 'object' || exception === null) return undefined;
    const candidate = exception as { name?: unknown; code?: unknown };
    if (
      candidate.name === 'PrismaClientKnownRequestError' &&
      typeof candidate.code === 'string'
    ) {
      return candidate.code;
    }
    return undefined;
  }

  private retryAfterSeconds(exception: unknown): number {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (body && typeof body === 'object') {
        const value = (body as Record<string, unknown>).retryAfter;
        if (typeof value === 'number' && Number.isFinite(value) && value >= 1) {
          return Math.ceil(value);
        }
      }
    }
    return DEFAULT_RETRY_AFTER_SECONDS;
  }
}