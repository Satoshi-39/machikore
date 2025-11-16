/**
 * 投稿のフィルタリング・ソートロジック
 *
 * FSDの原則：Features層のビジネスロジック
 * ページ固有のフィルター・ソート要件に対応
 */

import { useMemo } from 'react';
import { usePostStore } from '@/entities/post/model';
import type { PostRow } from '@/shared/types/database.types';

/**
 * 投稿一覧のフィルタリング・ソート処理
 *
 * @param posts - 元の投稿データ
 * @param userId - 現在のユーザーID
 * @returns フィルタリング・ソート済みの投稿
 */
export function usePostFiltering(posts: PostRow[] | undefined, userId: string) {
  const { sortOrder, filterMode } = usePostStore();

  // ソート処理
  const sortedPosts = useMemo(() => {
    if (!posts) return [];

    const sorted = [...posts];

    switch (sortOrder) {
      case 'latest':
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'popular':
        return sorted.sort((a, b) => b.likes_count - a.likes_count);
      default:
        return sorted;
    }
  }, [posts, sortOrder]);

  // フィルター処理
  const filteredPosts = useMemo(() => {
    switch (filterMode) {
      case 'all':
        return sortedPosts;
      case 'my-posts':
        return sortedPosts.filter((post) => post.user_id === userId);
      default:
        return sortedPosts;
    }
  }, [sortedPosts, filterMode, userId]);

  return filteredPosts;
}
