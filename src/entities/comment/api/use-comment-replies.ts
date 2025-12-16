/**
 * コメント返信hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  getCommentReplies,
  addReplyComment,
  type CommentWithUser,
} from '@/shared/api/supabase/comments';
import type { UUID } from '@/shared/types';
import { log } from '@/shared/config/logger';

/**
 * コメントの返信一覧を取得
 */
export function useCommentReplies(
  parentId: string | null,
  currentUserId?: string | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['comments', 'replies', parentId, currentUserId],
    queryFn: () => getCommentReplies(parentId!, 50, 0, currentUserId),
    enabled: !!parentId && enabled,
  });
}

interface AddReplyParams {
  userId: UUID;
  parentComment: CommentWithUser;
  content: string;
}

/**
 * コメントに返信を追加
 */
export function useAddReplyComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentWithUser, Error, AddReplyParams>({
    mutationFn: ({ userId, parentComment, content }) =>
      addReplyComment(userId, parentComment, content),
    onSuccess: (_, { parentComment }) => {
      // 返信一覧を再取得（プレフィックスで全てのcurrentUserIdパターンをinvalidate）
      queryClient.invalidateQueries({ queryKey: ['comments', 'replies', parentComment.id] });
      // 親コメントの返信数を更新するためコメント一覧も再取得
      if (parentComment.spot_id) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', parentComment.spot_id] });
      }
      if (parentComment.map_id) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', parentComment.map_id] });
      }

      Toast.show({
        type: 'success',
        text1: '返信を投稿しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Comment] Error:', error);
      Toast.show({
        type: 'error',
        text1: '返信の投稿に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
