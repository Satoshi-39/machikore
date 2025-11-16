/**
 * いいねをトグルするmutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { toggleLike } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';
import type { SpotRow } from '@/shared/types/database.types';

interface ToggleLikeParams {
  userId: UUID;
  spotId: UUID;
}

/**
 * いいねをトグル（追加/削除）
 */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleLikeParams>({
    mutationFn: async ({ userId, spotId }) => {
      return toggleLike(userId, spotId);
    },
    onSuccess: (isLiked, { userId, spotId }) => {
      // いいね状態のキャッシュを更新
      queryClient.setQueryData<boolean>(
        QUERY_KEYS.likeStatus(userId, spotId),
        isLiked
      );

      // スポット一覧のキャッシュを更新
      queryClient.setQueriesData<SpotRow[]>(
        { queryKey: QUERY_KEYS.spotsList(userId) },
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((spot) => {
            if (spot.id === spotId) {
              return {
                ...spot,
                likes_count: isLiked
                  ? spot.likes_count + 1
                  : Math.max(0, spot.likes_count - 1),
              };
            }
            return spot;
          });
        }
      );
    },
  });
}
