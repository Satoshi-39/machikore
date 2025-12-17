/**
 * 全大陸データを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getAllContinents } from '@/shared/api/sqlite';
import type { ContinentRow } from '@/shared/types/database.types';

/**
 * 全大陸データを取得
 */
export function useContinents() {
  return useQuery<ContinentRow[], Error>({
    queryKey: ['continents'],
    queryFn: () => {
      const continents = getAllContinents();
      return continents;
    },
    staleTime: Infinity, // 大陸データは変更されないため無期限キャッシュ
    gcTime: Infinity,
  });
}
