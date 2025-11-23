/**
 * 全市区町村データを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllCities } from '@/shared/api/sqlite';
import type { CityRow } from '@/shared/types/database.types';

/**
 * 全市区町村データを取得
 */
export function useCities() {
  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.cities(),
    queryFn: () => {
      const cities = getAllCities();
      return cities;
    },
    staleTime: Infinity, // 市区町村データは変更されないため無期限キャッシュ
    gcTime: Infinity,
  });
}
