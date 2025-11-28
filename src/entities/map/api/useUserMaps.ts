/**
 * ユーザーのマップ一覧取得フック
 *
 * Supabaseからユーザーの全マップを取得（公開・非公開含む）
 */

import { QUERY_KEYS } from '@/shared/api/query-client';
import { getUserMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

/**
 * ユーザーのマップ一覧を取得（Supabaseから）
 */
export function useUserMaps(userId: string | null) {
  return useQuery<MapWithUser[], Error>({
    queryKey: QUERY_KEYS.mapsList(userId || ''),
    queryFn: () => {
      if (!userId) return [];
      return getUserMaps(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
