/**
 * 全国データを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '@/shared/api/sqlite';
import type { CountryRow } from '@/shared/types/database.types';

/**
 * 全国データを取得
 */
export function useCountries() {
  return useQuery<CountryRow[], Error>({
    queryKey: ['countries'],
    queryFn: () => {
      const countries = getAllCountries();
      return countries;
    },
    staleTime: Infinity, // 国データは変更されないため無期限キャッシュ
    gcTime: Infinity,
  });
}
