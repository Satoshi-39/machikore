/**
 * コレクションにいいねしたユーザー一覧を取得するhook
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { getCollectionLikers } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { LIKERS_PAGE_SIZE } from '@/shared/config';

export function useCollectionLikers(collectionId: string | null) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.collectionLikers(collectionId || ''),
    queryFn: ({ pageParam }) => getCollectionLikers(collectionId!, LIKERS_PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < LIKERS_PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.likedAt;
    },
    enabled: !!collectionId,
  });
}
