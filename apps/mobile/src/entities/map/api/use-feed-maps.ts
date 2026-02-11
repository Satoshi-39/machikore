/**
 * フィード用マップ一覧を取得するhook
 *
 * Supabaseから公開マップを取得（他ユーザーのマップを含む）
 * cursor方式の無限スクロール対応
 * 将来的にはレコメンドロジック、人気順などに置き換え可能
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicMaps } from '@/shared/api/supabase';
import { FEED_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

/**
 * フィード用マップを取得（cursor方式無限スクロール対応）
 */
export function useFeedMaps() {
  return useInfiniteQuery<MapWithUser[], Error>({
    queryKey: QUERY_KEYS.mapsFeed(),
    queryFn: ({ pageParam }) => getPublicMaps(FEED_PAGE_SIZE, pageParam as string | undefined),
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
