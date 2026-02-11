/**
 * マップコメント取得・追加hooks
 *
 * TkDodo推奨: 楽観的更新は最小限にし、他はinvalidateで対応
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { COMMENTS_PAGE_SIZE, MAX_PAGES } from '@/shared/config';
import {
  getMapComments,
  getMapCommentsCount,
  addMapComment,
  type CommentWithUser,
} from '@/shared/api/supabase/comments';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { useI18n } from '@/shared/lib/i18n';
import type { UUID, UserBasicInfo } from '@/shared/types';
import { log } from '@/shared/config/logger';
import { invalidateMapCachesForComments } from './use-spot-comments';

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
    maxPages: MAX_PAGES.COMMENTS,
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
  const { t } = useI18n();

  return useMutation<CommentWithUser, Error, AddMapCommentParams>({
    mutationFn: ({ userId, mapId, content }) =>
      addMapComment(userId, mapId, content),
    onSuccess: (_newComment, { mapId }) => {
      // コメント一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
      // マップデータ（comments_count）を含むキャッシュを無効化
      invalidateMapCachesForComments(queryClient);

      Toast.show({
        type: 'success',
        text1: t('toast.commentPosted'),
        visibilityTime: 2000,
      });
    },
    onError: (error) => {
      log.error('[Comment] Error:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.commentPostFailed'),
        visibilityTime: 3000,
      });
    },
  });
}
