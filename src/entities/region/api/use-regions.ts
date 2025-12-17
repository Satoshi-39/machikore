/**
 * 全地方データを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getAllRegions } from '@/shared/api/sqlite';
import type { RegionRow } from '@/shared/types/database.types';

/**
 * 全地方データを取得
 */
export function useRegions() {
  return useQuery<RegionRow[], Error>({
    queryKey: ['regions'],
    queryFn: () => {
      const regions = getAllRegions();
      return regions;
    },
    staleTime: Infinity, // 地方データは変更されないため無期限キャッシュ
    gcTime: Infinity,
  });
}
