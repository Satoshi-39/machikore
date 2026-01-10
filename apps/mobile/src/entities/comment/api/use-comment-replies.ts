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
import { QUERY_KEYS } from '@/shared/api/query-client';
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
    queryKey: QUERY_KEYS.commentsRepliesWithUser(parentId || '', currentUserId),
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
      // フラット表示: ルートコメントのIDを特定
      const rootId = parentComment.parent_id === null ? parentComment.id : parentComment.root_id;

      // ルートコメントの返信一覧を再取得（プレフィックスマッチ）
      if (rootId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', rootId] });
      }
      // 元の親コメントの返信一覧も念のため再取得（従来の動作を維持）
      if (parentComment.id !== rootId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', parentComment.id] });
      }

      // 親コメントの返信数を更新するためコメント一覧も再取得（プレフィックスマッチ）
      if (parentComment.user_spot_id) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', parentComment.user_spot_id] });
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
