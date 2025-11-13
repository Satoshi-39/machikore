/**
 * ユーザーの投稿を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPostsByUserId } from '@/shared/api/sqlite';
import type { PostRow } from '@/shared/types/database.types';

/**
 * ユーザーの全投稿を取得
 */
export function usePosts(userId: string) {
  return useQuery<PostRow[], Error>({
    queryKey: QUERY_KEYS.postsList(userId),
    queryFn: () => {
      return getPostsByUserId(userId);
    },
    enabled: !!userId,
  });
}
