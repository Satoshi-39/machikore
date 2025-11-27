/**
 * フィード用マップ一覧を取得するhook
 *
 * 現在は全公開マップを新着順で取得
 * 将来的にはレコメンドロジック、人気順などに置き換え可能
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicMaps } from '@/shared/api/sqlite';
import type { MapRow } from '@/shared/types/database.types';

/**
 * フィード用マップを取得
 */
export function useFeedMaps() {
  return useQuery<MapRow[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'feed'],
    queryFn: () => getPublicMaps(),
  });
}
