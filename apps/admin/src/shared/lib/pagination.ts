import { PAGINATION } from "@/shared/config";
import type { PaginatedResult } from "@/shared/types";

/** ページネーションのrange計算 */
export function getPaginationRange(page?: number, perPage?: number) {
  const resolvedPage = page ?? 1;
  const resolvedPerPage = perPage ?? PAGINATION.DEFAULT_PER_PAGE;
  const from = (resolvedPage - 1) * resolvedPerPage;
  const to = from + resolvedPerPage - 1;
  return { from, to, page: resolvedPage, perPage: resolvedPerPage };
}

/** ページネーション結果を構築 */
export function buildPaginatedResult<T>(
  data: T[],
  count: number | null,
  page: number,
  perPage: number
): PaginatedResult<T> {
  const totalCount = count ?? 0;
  return {
    data,
    totalCount,
    page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
  };
}
