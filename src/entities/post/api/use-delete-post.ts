/**
 * 投稿を削除するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidatePosts } from '@/shared/api/query-client';
import { deletePost } from '@/shared/api/sqlite';

/**
 * 投稿を削除（関連する画像も連鎖削除される）
 */
export function useDeletePost() {
  return useMutation({
    mutationFn: async (postId: string) => {
      deletePost(postId);
      return postId;
    },
    onSuccess: () => {
      invalidatePosts();
    },
  });
}
