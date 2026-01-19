/**
 * コメントいいねhooks
 *
 * 楽観的更新でUIを即座に反映し、エラー時はロールバック
 */

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { likeComment, unlikeComment, type CommentWithUser } from '@/shared/api/supabase/comments';
import type { UUID } from '@/shared/types';
import { log } from '@/shared/config/logger';

interface LikeCommentParams {
  userId: UUID;
  commentId: UUID;
  spotId?: UUID | null;
  mapId?: UUID | null;
  /** 返信の場合の親コメントID */
  parentId?: UUID | null;
}

type CommentPages = InfiniteData<CommentWithUser[]>;

interface PreviousDataItem {
  queryKey: readonly unknown[];
  data: CommentPages;
}

interface MutationContext {
  previousData: PreviousDataItem[];
}

/**
 * コメントのいいね状態を楽観的に更新するヘルパー
 */
function updateCommentLikeInPages(
  pages: CommentWithUser[][],
  commentId: string,
  isLiked: boolean
): CommentWithUser[][] {
  return pages.map((page) =>
    page.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            is_liked: isLiked,
            likes_count: isLiked
              ? comment.likes_count + 1
              : Math.max(0, comment.likes_count - 1),
          }
        : comment
    )
  );
}

/**
 * コメントにいいねを追加
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LikeCommentParams, MutationContext>({
    mutationFn: ({ userId, commentId }) => likeComment(userId, commentId),
    onMutate: async ({ commentId, spotId, mapId, parentId }) => {
      // 関連するクエリをキャンセル
      const queryKeys: unknown[][] = [];

      if (spotId) {
        await queryClient.cancelQueries({ queryKey: ['comments', 'spot', spotId] });
        queryKeys.push(['comments', 'spot', spotId]);
      }
      if (mapId) {
        await queryClient.cancelQueries({ queryKey: ['comments', 'map', mapId] });
        queryKeys.push(['comments', 'map', mapId]);
      }
      if (parentId) {
        await queryClient.cancelQueries({ queryKey: ['comments', 'replies', parentId] });
        queryKeys.push(['comments', 'replies', parentId]);
      }

      // 現在のキャッシュを保存（ロールバック用）
      const previousData: PreviousDataItem[] = [];

      // 各クエリキーに対して楽観的更新を実行
      queryKeys.forEach((baseKey) => {
        // プレフィックスマッチで該当するすべてのクエリを取得
        const queries = queryClient.getQueriesData<CommentPages>({ queryKey: baseKey });

        queries.forEach(([queryKey, data]) => {
          if (data?.pages) {
            previousData.push({ queryKey, data });

            queryClient.setQueryData<CommentPages>(queryKey, {
              ...data,
              pages: updateCommentLikeInPages(data.pages, commentId, true),
            });
          }
        });
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      log.error('[Comment] Like Error:', error);
      // エラー時はロールバック
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_, __, { spotId, mapId, parentId }) => {
      // 完了後にバックグラウンドで再取得
      if (spotId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
      }
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', parentId] });
      }
    },
  });
}

/**
 * コメントのいいねを取り消し
 */
export function useUnlikeComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LikeCommentParams, MutationContext>({
    mutationFn: ({ userId, commentId }) => unlikeComment(userId, commentId),
    onMutate: async ({ commentId, spotId, mapId, parentId }) => {
      // 関連するクエリをキャンセル
      const queryKeys: unknown[][] = [];

      if (spotId) {
        await queryClient.cancelQueries({ queryKey: ['comments', 'spot', spotId] });
        queryKeys.push(['comments', 'spot', spotId]);
      }
      if (mapId) {
        await queryClient.cancelQueries({ queryKey: ['comments', 'map', mapId] });
        queryKeys.push(['comments', 'map', mapId]);
      }
      if (parentId) {
        await queryClient.cancelQueries({ queryKey: ['comments', 'replies', parentId] });
        queryKeys.push(['comments', 'replies', parentId]);
      }

      // 現在のキャッシュを保存（ロールバック用）
      const previousData: PreviousDataItem[] = [];

      // 各クエリキーに対して楽観的更新を実行
      queryKeys.forEach((baseKey) => {
        // プレフィックスマッチで該当するすべてのクエリを取得
        const queries = queryClient.getQueriesData<CommentPages>({ queryKey: baseKey });

        queries.forEach(([queryKey, data]) => {
          if (data?.pages) {
            previousData.push({ queryKey, data });

            queryClient.setQueryData<CommentPages>(queryKey, {
              ...data,
              pages: updateCommentLikeInPages(data.pages, commentId, false),
            });
          }
        });
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      log.error('[Comment] Unlike Error:', error);
      // エラー時はロールバック
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_, __, { spotId, mapId, parentId }) => {
      // 完了後にバックグラウンドで再取得
      if (spotId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'spot', spotId] });
      }
      if (mapId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'map', mapId] });
      }
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'replies', parentId] });
      }
    },
  });
}
