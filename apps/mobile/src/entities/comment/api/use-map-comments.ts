/**
 * マップコメント取得・追加hooks
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { COMMENTS_PAGE_SIZE } from '@/shared/config';
import {
  getMapComments,
  getMapCommentsCount,
  addMapComment,
  type CommentWithUser,
} from '@/shared/api/supabase/comments';
import { QUERY_KEYS } from '@/shared/api/query-client';
import type { UUID, UserBasicInfo } from '@/shared/types';
import { log } from '@/shared/config/logger';

interface UseMapCommentsOptions {
  currentUserId?: string | null;
  /** マップ投稿者ID（投稿者いいね表示用） */
  authorId?: string | null;
  /** マップ投稿者情報（投稿者いいねアバター表示用） */
  author?: UserBasicInfo | null;
}

/**
 * マップのコメント一覧を取得（無限スクロール対応）
 */
export function useMapComments(
  mapId: string | null,
  options?: UseMapCommentsOptions
) {
  const { currentUserId, authorId, author } = options || {};
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.commentsMap(mapId || '', currentUserId),
    queryFn: ({ pageParam }) =>
      getMapComments(mapId!, COMMENTS_PAGE_SIZE, pageParam, { currentUserId, authorId, author }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得件数がページサイズ未満なら次ページなし
      if (lastPage.length < COMMENTS_PAGE_SIZE) {
        return undefined;
      }
      // 最後のコメントのcreated_atをカーソルとして返す
      const lastComment = lastPage[lastPage.length - 1];
      return lastComment?.created_at;
    },
    enabled: !!mapId,
  });
}

/**
 * マップのトップレベルコメント総数を取得
 */
export function useMapCommentsCount(mapId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.commentsMapCount(mapId || ''),
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
      // コメント一覧を再取得（プレフィックスマッチで全関連キャッシュを無効化）
      queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
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
      log.error('[Comment] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'コメントの投稿に失敗しました',
        visibilityTime: 3000,
      });
    },
  });
}
