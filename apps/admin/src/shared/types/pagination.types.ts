/** ページネーション結果の共通型 */
export type PaginatedResult<T> = {
  data: T[];
  totalCount: number;
  page: number;
  perPage: number;
  totalPages: number;
};

/** ページネーションパラメータの共通型 */
export type PaginationParams = {
  page?: number;
  perPage?: number;
};
