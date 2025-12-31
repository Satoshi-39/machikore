/**
 * フィード用マップ一覧を取得するhook
 *
 * Supabaseから公開マップを取得（他ユーザーのマップを含む）
 * 無限スクロール対応
 * 将来的にはレコメンドロジック、人気順などに置き換え可能
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

const PAGE_SIZE = 10;

/**
 * フィード用マップを取得（無限スクロール対応）
 */
export function useFeedMaps() {
  return useInfiniteQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'feed'],
    queryFn: ({ pageParam = 0 }) => getPublicMaps(PAGE_SIZE, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 取得した件数がPAGE_SIZE未満なら次のページはない
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      // 次のページのオフセットを返す
      return allPages.length * PAGE_SIZE;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
