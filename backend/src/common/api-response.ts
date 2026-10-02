// backend/src/common/api-response.ts
// envelope ตาม api-conventions.md ข้อ 3-4 — key ระดับบนมีได้แค่ success · data · meta (สำเร็จ)
// และ success · error (ล้มเหลว)

import type { ErrorCode } from './error-codes';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(
  data: T,
  meta?: PaginationMeta,
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta !== undefined ? { meta } : {}),
  };
}

export function errorResponse(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
}