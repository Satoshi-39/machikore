/**
 * IDで投稿を取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPostById } from '@/shared/api/sqlite';
import type { PostRow } from '@/shared/types/database.types';

/**
 * IDで投稿を取得
 */
export function usePostById(postId: string) {
  return useQuery<PostRow | null, Error>({
    queryKey: QUERY_KEYS.postsDetail(postId),
    queryFn: () => {
      return getPostById(postId);
    },
    enabled: !!postId,
  });
}
