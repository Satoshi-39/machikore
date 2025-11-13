/**
 * 投稿を作成するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidatePosts } from '@/shared/api/query-client';
import { insertPost } from '@/shared/api/sqlite';
import { createPostData, validateCreatePostParams } from '../model';
import type { CreatePostParams } from '../model/types';

/**
 * 投稿を作成
 */
export function useCreatePost() {
  return useMutation({
    mutationFn: async (params: CreatePostParams) => {
      // バリデーション
      const validation = validateCreatePostParams(params);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 投稿を作成
      const newPost = createPostData(params);
      insertPost(newPost);

      return newPost.id;
    },
    onSuccess: () => {
      invalidatePosts();
    },
  });
}
