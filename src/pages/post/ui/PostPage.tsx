/**
 * ログページ（投稿一覧）
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostList } from '@/widgets/post-list';
import { PostFilterHeader } from '@/features/post';
import { useCurrentUserId } from '@/entities/user';

export function PostPage() {
  const currentUserId = useCurrentUserId();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">
        <PostFilterHeader />
        <PostList userId={currentUserId ?? undefined} />
      </View>
    </SafeAreaView>
  );
}
