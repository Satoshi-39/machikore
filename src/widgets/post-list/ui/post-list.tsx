/**
 * PostList ウィジェット
 *
 * 投稿一覧を表示するウィジェット
 */

import React from 'react';
import { FlatList, View } from 'react-native';
import { usePosts } from '@/entities/post/api';
import { PostCard, usePostFiltering } from '@/features/post';
import { AsyncBoundary } from '@/shared/ui';
import type { PostRow } from '@/shared/types/database.types';

interface PostListProps {
  userId?: string;
  onPostPress?: (post: PostRow) => void;
}

export function PostList({ userId, onPostPress }: PostListProps) {
  const effectiveUserId = userId ?? '';
  const { data: posts, isLoading, error } = usePosts(effectiveUserId);

  // フィルタリング・ソート処理
  const filteredPosts = usePostFiltering(posts, effectiveUserId);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={posts}
      loadingMessage="投稿を読み込み中..."
      emptyMessage="まだ投稿がありません"
      emptyIcon="📝"
    >
      {() => (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              userId={effectiveUserId}
              onPress={() => onPostPress?.(item)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
          contentContainerStyle={filteredPosts.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </AsyncBoundary>
  );
}
