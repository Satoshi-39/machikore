/**
 * 投稿を更新するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidatePosts } from '@/shared/api/query-client';
import { updatePost } from '@/shared/api/sqlite';
import type { UpdatePostParams } from '../model/types';

/**
 * 投稿を更新
 */
export function useUpdatePost() {
  return useMutation({
    mutationFn: async (params: UpdatePostParams) => {
      const now = new Date().toISOString();

      updatePost(params.postId, {
        content: params.content,
        machi_id: params.stationId,
        is_draft: params.isDraft !== undefined ? (params.isDraft ? 1 : 0) : undefined,
        updated_at: now,
      });

      return params.postId;
    },
    onSuccess: () => {
      invalidatePosts();
    },
  });
}
