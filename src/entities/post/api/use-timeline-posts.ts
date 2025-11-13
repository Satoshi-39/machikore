/**
 * タイムライン投稿を取得するhook
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS, DEFAULT_PAGE_SIZE } from '@/shared/api/query-client';
import { getTimelinePosts } from '@/shared/api/sqlite';
import type { PostRow } from '@/shared/types/database.types';

/**
 * タイムラインの投稿を取得（無限スクロール対応）
 */
export function useTimelinePosts(pageSize: number = DEFAULT_PAGE_SIZE) {
  return useInfiniteQuery<PostRow[], Error>({
    queryKey: QUERY_KEYS.postsTimeline(),
    queryFn: ({ pageParam = 0 }) => {
      return getTimelinePosts(pageSize, pageParam as number);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < pageSize) return undefined;
      return allPages.length * pageSize;
    },
    initialPageParam: 0,
  });
}
