/**
 * マップコメント取得・追加hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  getMapComments,
  getMapCommentsCount,
  addMapComment,
  type CommentWithUser,
} from '@/shared/api/supabase/comments';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID } from '@/shared/types';

/**
 * マップのコメント一覧を取得
 */
export function useMapComments(
  mapId: string | null,
  limit: number = 50,
  offset: number = 0,
  currentUserId?: string | null
) {
  return useQuery({
    queryKey: ['comments', 'map', mapId, { limit, offset }, currentUserId],
    queryFn: () => getMapComments(mapId!, limit, offset, currentUserId),
    enabled: !!mapId,
  });
}

/**
 * マップのトップレベルコメント総数を取得
 */
export function useMapCommentsCount(mapId: string | null) {
  return useQuery({
    queryKey: ['comments', 'map', mapId, 'count'],
    queryFn: () => getMapCommentsCount(mapId!),
    enabled: !!mapId,
  });
}

interface AddMapCommentParams {
  userId: UUID;
  mapId: UUID;
  content: string;
}

/**
 * マップにコメントを追加
 */
export function useAddMapComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentWithUser, Error, AddMapCommentParams>({
    mutationFn: ({ userId, mapId, content }) =>
      addMapComment(userId, mapId, content),
    onSuccess: (_newComment, { mapId }) => {
      // コメント一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
      // コメント総数を再取得
      queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId, 'count'] });
      // マップのコメント数を更新（一覧と個別詳細の両方）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mapsDetail(mapId) });

      Toast.show({
        type: 'success',
        text1: 'コメントを投稿しました',
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      console.error('[useAddMapComment] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コメントの投稿に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
