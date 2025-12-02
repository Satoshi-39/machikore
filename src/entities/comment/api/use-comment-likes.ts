/**
 * コメントいいねhooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeComment, unlikeComment } from '@/shared/api/supabase/comments';
import type { UUID } from '@/shared/types';

interface LikeCommentParams {
  userId: UUID;
  commentId: UUID;
  spotId?: UUID | null;
  mapId?: UUID | null;
}

/**
 * コメントにいいねを追加
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LikeCommentParams>({
    mutationFn: ({ userId, commentId }) => likeComment(userId, commentId),
    onSuccess: (_, { spotId, mapId }) => {
      // コメント一覧を再取得
      if (spotId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
        queryClient.invalidateQueries({ queryKey: ['replies'] });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
        queryClient.invalidateQueries({ queryKey: ['replies'] });
      }
    },
    onError: (error) => {
      console.error('[useLikeComment] Error:', error);
    },
  });
}

/**
 * コメントのいいねを取り消し
 */
export function useUnlikeComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LikeCommentParams>({
    mutationFn: ({ userId, commentId }) => unlikeComment(userId, commentId),
    onSuccess: (_, { spotId, mapId }) => {
      // コメント一覧を再取得
      if (spotId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
        queryClient.invalidateQueries({ queryKey: ['replies'] });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
        queryClient.invalidateQueries({ queryKey: ['replies'] });
      }
    },
    onError: (error) => {
      console.error('[useUnlikeComment] Error:', error);
    },
  });
}
