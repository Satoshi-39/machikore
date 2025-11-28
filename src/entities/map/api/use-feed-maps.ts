/**
 * フィード用マップ一覧を取得するhook
 *
 * Supabaseから公開マップを取得（他ユーザーのマップを含む）
 * 将来的にはレコメンドロジック、人気順などに置き換え可能
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

/**
 * フィード用マップを取得（Supabaseから）
 */
export function useFeedMaps() {
  return useQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'feed'],
    queryFn: () => getPublicMaps(),
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
