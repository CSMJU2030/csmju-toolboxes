// backend/src/common/response.interceptor.ts
// ห่อ response ที่สำเร็จทุกตัวด้วย { success: true, data, meta? }
// service คืนค่าดิบได้เลย · ถ้าเป็นรายการแบบแบ่งหน้าให้คืน { items, meta }

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { successResponse, type PaginationMeta } from './api-response';

interface PagedResult {
  items: unknown[];
  meta: PaginationMeta;
}

function isPagedResult(value: unknown): value is PagedResult {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return Array.isArray(candidate.items) && typeof candidate.meta === 'object';
}

function isAlreadyEnveloped(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in (value as Record<string, unknown>)
  );
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((result: unknown) => {
        if (isAlreadyEnveloped(result)) return result;
        if (isPagedResult(result)) {
          return successResponse(result.items, result.meta);
        }
        return successResponse(result ?? null);
      }),
    );
  }
}