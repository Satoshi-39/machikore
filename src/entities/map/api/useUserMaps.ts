/**
 * ユーザーのマップ一覧取得フック
 */

import { QUERY_KEYS } from '@/shared/api/query-client';
import { getMapsByUserId } from '@/shared/api/sqlite';
import type { MapRow } from '@/shared/types/database.types';
import { useQuery } from '@tanstack/react-query';

/**
 * ユーザーのマップ一覧を取得
 */
export function useUserMaps(userId: string | null) {
  return useQuery<MapRow[]>({
    queryKey: QUERY_KEYS.mapsList(userId || ''),
    queryFn: () => {
      if (!userId) return [];
      return getMapsByUserId(userId);
    },
    enabled: !!userId,
  });
}
