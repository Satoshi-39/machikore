/**
 * スポットにいいねしたユーザー一覧を取得するhook
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getSpotLikers } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { LIKERS_PAGE_SIZE, MAX_PAGES } from '@/shared/config';

export function useSpotLikers(spotId: string | null) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.spotLikers(spotId || ''),
    queryFn: ({ pageParam }) => getSpotLikers(spotId!, LIKERS_PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < LIKERS_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.likedAt;
    },
    maxPages: MAX_PAGES.LIKERS,
    enabled: !!spotId,
  });
}
