/**
 * コメントいいねhooks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeComment, unlikeComment } from '@/shared/api/supabase/comments';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID } from '@/shared/types';
import { log } from '@/shared/config/logger';

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
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.commentsSpot(spotId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.commentsMap(mapId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
      }
    },
    onError: (error) => {
      log.error('[Comment] Error:', error);
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.commentsSpot(spotId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.commentsMap(mapId) });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments });
      }
    },
    onError: (error) => {
      log.error('[Comment] Error:', error);
    },
  });
}
