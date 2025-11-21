/**
 * ユーザーがスポットにいいねしているか確認するhook
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { checkUserLiked } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';

/**
 * ユーザーがスポットにいいねしているか確認
 */
export function useCheckUserLiked(userId: UUID, spotId: UUID) {
  return useQuery<boolean, Error>({
    queryKey: QUERY_KEYS.likeStatus(userId, spotId),
    queryFn: () => checkUserLiked(userId, spotId),
    enabled: !!userId && !!spotId,
  });
}
