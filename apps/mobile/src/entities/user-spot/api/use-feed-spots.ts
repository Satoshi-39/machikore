/**
 * フィード用スポット一覧を取得するhook
 *
 * Supabaseから公開スポットを取得（無限スクロール対応）
 * 将来的にはレコメンドロジック、人気順、フォロー中ユーザーのスポットなどに置き換え可能
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicSpots } from '@/shared/api/supabase';
import type { SpotWithDetails } from '@/shared/types';

const PAGE_SIZE = 10;

/**
 * フィード用スポットを取得（無限スクロール対応）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export function useFeedSpots(currentUserId?: string | null) {
  return useInfiniteQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'feed', currentUserId],
    queryFn: ({ pageParam = 0 }) => getPublicSpots(PAGE_SIZE, pageParam as number, currentUserId),
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
