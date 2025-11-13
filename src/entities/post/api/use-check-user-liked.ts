/**
 * ユーザーが投稿にいいねしているか確認するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { checkUserLiked } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';

/**
 * ユーザーが投稿にいいねしているか確認
 */
export function useCheckUserLiked(userId: UUID, postId: UUID) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.likeStatus(userId, postId),
    queryFn: () => checkUserLiked(userId, postId),
    enabled: !!userId && !!postId,
  });
}
