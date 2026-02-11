/**
 * コメント返信hooks
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { COMMENTS_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import {
  getCommentReplies,
  addReplyComment,
  type CommentWithUser,
} from '@/shared/api/supabase/comments';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { useI18n } from '@/shared/lib/i18n';
import type { UUID, UserBasicInfo } from '@/shared/types';
import { log } from '@/shared/config/logger';

interface UseCommentRepliesOptions {
  currentUserId?: string | null;
  /** 投稿者ID（投稿者いいね表示用） */
  authorId?: string | null;
  /** 投稿者情報（投稿者いいねアバター表示用） */
  author?: UserBasicInfo | null;
  enabled?: boolean;
}

/**
 * コメントの返信一覧を取得（無限スクロール対応）
 */
export function useCommentReplies(
  parentId: string | null,
  options?: UseCommentRepliesOptions
) {
  const { currentUserId, authorId, author, enabled = true } = options || {};
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.commentsRepliesWithUser(parentId || '', currentUserId),
    queryFn: ({ pageParam }) =>
      getCommentReplies(parentId!, COMMENTS_PAGE_SIZE, pageParam, { currentUserId, authorId, author }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得件数がページサイズ未満なら次ページなし
      if (lastPage.length < COMMENTS_PAGE_SIZE) {
        return undefined;
      }
      // 最後の返信のcreated_atをカーソルとして返す
      const lastReply = lastPage[lastPage.length - 1];
      return lastReply?.created_at;
    },
    maxPages: MAX_PAGES.COMMENTS,
    enabled: !!parentId && enabled,
  });
}

interface AddReplyParams {
  userId: UUID;
  parentComment: CommentWithUser;
  content: string;
  /** 返信先のユーザーID（明示的に返信ボタンを押した場合のみ指定） */
  replyToUserId?: string;
}

/**
 * コメントに返信を追加
 */
export function useAddReplyComment() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<CommentWithUser, Error, AddReplyParams>({
    mutationFn: ({ userId, parentComment, content, replyToUserId }) =>
      addReplyComment(userId, parentComment, content, replyToUserId),
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
        text1: t('toast.replyPosted'),
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Comment] Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.replyPostFailed'),
        visibilityTime: 3000,
      });
    },
  });
}
