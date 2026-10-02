// backend/src/pagination/pagination.ts

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function normalizePagination(
  query: PaginationQuery,
): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = normalizePage(query.page);
  const limit = normalizeLimit(query.limit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages:
      total === 0
        ? 0
        : Math.ceil(total / limit),
  };
}

function normalizePage(
  page?: number,
): number {
  if (
    page === undefined ||
    !Number.isFinite(page)
  ) {
    return DEFAULT_PAGE;
  }

  return Math.max(
    DEFAULT_PAGE,
    Math.floor(page),
  );
}

function normalizeLimit(
  limit?: number,
): number {
  if (
    limit === undefined ||
    !Number.isFinite(limit)
  ) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    MAX_LIMIT,
    Math.max(1, Math.floor(limit)),
  );
}