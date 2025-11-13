/**
 * 全街データを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllMachi } from '@/shared/api/sqlite';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 全街データを取得
 */
export function useMachi() {
  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiList(),
    queryFn: () => {
      const machiList = getAllMachi();
      return machiList;
    },
    staleTime: Infinity, // 街データは変更されないため無期限キャッシュ
    gcTime: Infinity,
  });
}
