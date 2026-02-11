/**
 * マップにいいねしたユーザー一覧を取得するhook
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMapLikers } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { LIKERS_PAGE_SIZE, MAX_PAGES } from '@/shared/config';

export function useMapLikers(mapId: string | null) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.mapLikers(mapId || ''),
    queryFn: ({ pageParam }) => getMapLikers(mapId!, LIKERS_PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < LIKERS_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.likedAt;
    },
    maxPages: MAX_PAGES.LIKERS,
    enabled: !!mapId,
  });
}
