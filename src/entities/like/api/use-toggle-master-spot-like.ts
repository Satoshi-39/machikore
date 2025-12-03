/**
 * マスタースポットいいねをトグルするmutation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { checkMasterSpotLiked, toggleMasterSpotLike } from '@/shared/api/supabase/likes';
import type { UUID } from '@/shared/types';

interface ToggleMasterSpotLikeParams {
  userId: UUID;
  masterSpotId: UUID;
}

interface MutationContext {
  previousLikeStatus: boolean | undefined;
}

/**
 * マスタースポットのいいね状態をチェック
 */
export function useCheckMasterSpotLiked(userId: UUID | null | undefined, masterSpotId: UUID | null | undefined) {
  return useQuery<boolean, Error>({
    queryKey: ['master-spot-like-status', userId, masterSpotId],
    queryFn: () => {
      if (!userId || !masterSpotId) return false;
      return checkMasterSpotLiked(userId, masterSpotId);
    },
    enabled: !!userId && !!masterSpotId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * マスタースポットのいいねをトグル（追加/削除）
 */
export function useToggleMasterSpotLike() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleMasterSpotLikeParams, MutationContext>({
    mutationFn: async ({ userId, masterSpotId }) => {
      return toggleMasterSpotLike(userId, masterSpotId);
    },
    onMutate: async ({ userId, masterSpotId }) => {
      await queryClient.cancelQueries({ queryKey: ['master-spot-like-status', userId, masterSpotId] });

      const previousLikeStatus = queryClient.getQueryData<boolean>(
        ['master-spot-like-status', userId, masterSpotId]
      );

      const newLikeStatus = !previousLikeStatus;
      queryClient.setQueryData<boolean>(
        ['master-spot-like-status', userId, masterSpotId],
        newLikeStatus
      );

      return { previousLikeStatus };
    },
    onError: (err, { userId, masterSpotId }, context) => {
      console.error('[useToggleMasterSpotLike] Error:', err);
      Toast.show({
        type: 'error',
        text1: 'いいねに失敗しました',
        visibilityTime: 3000,
      });
      if (context?.previousLikeStatus !== undefined) {
        queryClient.setQueryData<boolean>(
          ['master-spot-like-status', userId, masterSpotId],
          context.previousLikeStatus
        );
      }
    },
  });
}
