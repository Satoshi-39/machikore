/**
 * いいねをトグルするmutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { toggleLike } from '@/shared/api/sqlite';
import type { UUID } from '@/shared/types';
import type { PostRow } from '@/shared/types/database.types';

interface ToggleLikeParams {
  userId: UUID;
  postId: UUID;
}

/**
 * いいねをトグル（追加/削除）
 */
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, ToggleLikeParams>({
    mutationFn: async ({ userId, postId }) => {
      return toggleLike(userId, postId);
    },
    onSuccess: (isLiked, { userId, postId }) => {
      // いいね状態のキャッシュを更新
      queryClient.setQueryData<boolean>(
        QUERY_KEYS.likeStatus(userId, postId),
        isLiked
      );

      // 投稿一覧のキャッシュを更新
      queryClient.setQueriesData<PostRow[]>(
        { queryKey: QUERY_KEYS.postsList(userId) },
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likes_count: isLiked
                  ? post.likes_count + 1
                  : post.likes_count - 1,
              };
            }
            return post;
          });
        }
      );

      // 投稿詳細のキャッシュも更新（存在する場合）
      queryClient.setQueryData<PostRow>(
        QUERY_KEYS.postDetail(postId),
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            likes_count: isLiked
              ? oldData.likes_count + 1
              : oldData.likes_count - 1,
          };
        }
      );
    },
    onError: (error) => {
      console.error('いいねのトグルに失敗しました:', error);
    },
  });
}
