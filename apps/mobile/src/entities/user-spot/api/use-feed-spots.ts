/**
 * フィード用スポット一覧を取得するhook
 *
 * Supabaseから公開スポットを取得（cursor方式無限スクロール対応）
 * 将来的にはレコメンドロジック、人気順、フォロー中ユーザーのスポットなどに置き換え可能
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicSpots } from '@/shared/api/supabase';
import { FEED_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import type { SpotWithDetails } from '@/shared/types';

/**
 * フィード用スポットを取得（cursor方式無限スクロール対応）
 * @param currentUserId - 現在のユーザーID（いいね状態を取得するため）
 */
export function useFeedSpots(currentUserId?: string | null) {
  return useInfiniteQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'feed', currentUserId],
    queryFn: ({ pageParam }) => getPublicSpots(FEED_PAGE_SIZE, pageParam as string | undefined, currentUserId),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのcreated_atをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.created_at;
    },
    maxPages: MAX_PAGES.FEED,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
