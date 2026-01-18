/**
 * 全都道府県データを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllPrefectures } from '@/shared/api/sqlite';
import type { PrefectureRow } from '@/shared/types/database.types';

/**
 * 全都道府県データを取得
 */
export function usePrefectures() {
  return useQuery<PrefectureRow[], Error>({
    queryKey: QUERY_KEYS.prefectures(),
    queryFn: getAllPrefectures,
    staleTime: Infinity, // 都道府県データは変更されないため無期限キャッシュ
    gcTime: Infinity,
  });
}
