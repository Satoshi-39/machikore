/**
 * スポットコメント取得・追加hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { log } from '@/shared/config/logger';
import {
  getSpotComments,
  addSpotComment,
  updateComment,
  deleteComment,
  type CommentWithUser,
} from '@/shared/api/supabase/comments';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID } from '@/shared/types';

/**
 * スポットのコメント一覧を取得
 */
export function useSpotComments(
  spotId: string | null,
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
) {
  return useQuery({
    queryKey: QUERY_KEYS.commentsSpot(spotId || '', { limit, offset }, currentUserId),
    queryFn: () => getSpotComments(spotId!, limit, offset, currentUserId),
    enabled: !!spotId,
  });
}

interface AddSpotCommentParams {
  userId: UUID;
  spotId: UUID;
  content: string;
}

/**
 * スポットにコメントを追加
 */
export function useAddSpotComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentWithUser, Error, AddSpotCommentParams>({
    mutationFn: ({ userId, spotId, content }) =>
      addSpotComment(userId, spotId, content),
    onSuccess: (_newComment, { spotId }) => {
      // コメント一覧を再取得（プレフィックスマッチで全関連キャッシュを無効化）
      queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
      // スポットのコメント数を更新（一覧と個別詳細の両方）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spots });
      // スポット詳細キャッシュも無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsDetail(spotId) });

      Toast.show({
        type: 'success',
        text1: 'コメントを投稿しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Comment] useAddSpotComment Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コメントの投稿に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}

interface UpdateCommentParams {
  commentId: UUID;
  content: string;
  spotId?: UUID | null;
  mapId?: UUID | null;
  parentId?: UUID | null;
}

/**
 * コメントを更新
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentWithUser, Error, UpdateCommentParams>({
    mutationFn: ({ commentId, content }) =>
      updateComment(commentId, content),
    onSuccess: (_, { spotId, mapId, parentId }) => {
      // コメント一覧を再取得（プレフィックスマッチ）
      if (spotId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
      }
      // 返信コメントの場合は親コメントの返信一覧も再取得
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', parentId] });
      }

      Toast.show({
        type: 'success',
        text1: 'コメントを編集しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Comment] useUpdateComment Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コメントの編集に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}

interface DeleteCommentParams {
  commentId: UUID;
  spotId?: UUID | null;
  mapId?: UUID | null;
  parentId?: UUID | null;
}

/**
 * コメントを削除
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteCommentParams>({
    mutationFn: ({ commentId }) => deleteComment(commentId),
    onSuccess: (_, { spotId, mapId, parentId }) => {
      // コメント一覧を再取得（プレフィックスマッチ）
      if (spotId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
        // トップレベルコメントの場合のみスポット一覧を更新（カウント更新のため）
        if (!parentId) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spots });
          // スポット詳細キャッシュも無効化
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.spotsDetail(spotId) });
        }
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
        // トップレベルコメントの場合のみマップ一覧を更新
        if (!parentId) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
          // マップ詳細キャッシュも無効化
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsDetail(mapId) });
        }
      }
      // 返信削除の場合は親コメントの返信一覧を再取得
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', parentId] });
      }

      Toast.show({
        type: 'success',
        text1: 'コメントを削除しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Comment] useDeleteComment Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コメントの削除に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
