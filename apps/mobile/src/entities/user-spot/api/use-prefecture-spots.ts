/**
 * 都道府県別スポット検索hooks
 * cursor方式の無限スクロール対応
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import {
  getPublicSpotsByPrefecture,
  getPublicSpotsByPrefectureAndCategory,
} from '@/shared/api/supabase/user-spots';
import { FEED_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import type { SpotWithDetails } from '@/shared/types';

/**
 * 都道府県IDで公開スポットを検索（無限スクロール対応）
 */
export function usePrefectureSpots(
  prefectureId: string,
  currentUserId?: string | null
) {
  return useInfiniteQuery<SpotWithDetails[], Error>({
    queryKey: [...QUERY_KEYS.spots, 'prefecture', prefectureId, currentUserId],
    queryFn: ({ pageParam }) =>
      getPublicSpotsByPrefecture(
        prefectureId,
        currentUserId,
        FEED_PAGE_SIZE,
        pageParam as string | undefined
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.created_at;
    },
    maxPages: MAX_PAGES.FEED,
    enabled: prefectureId.length > 0,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}

/**
 * 都道府県ID + カテゴリIDで公開スポットを検索（無限スクロール対応）
 */
export function usePrefectureCategorySpots(
  prefectureId: string,
  categoryId: string,
  currentUserId?: string | null
) {
  return useInfiniteQuery<SpotWithDetails[], Error>({
    queryKey: [
      ...QUERY_KEYS.spots,
      'prefecture-category',
      prefectureId,
      categoryId,
      currentUserId,
    ],
    queryFn: ({ pageParam }) =>
      getPublicSpotsByPrefectureAndCategory(
        prefectureId,
        categoryId,
        currentUserId,
        FEED_PAGE_SIZE,
        pageParam as string | undefined
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.created_at;
    },
    maxPages: MAX_PAGES.FEED,
    enabled: prefectureId.length > 0 && categoryId.length > 0,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
}
