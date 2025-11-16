/**
 * ログページ（投稿一覧）
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * NOTE: Post→Spotアーキテクチャ移行により、このページは将来的に再設計が必要
 */

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { PostList } from '@/widgets/post-list'; // TODO: SpotListに変更予定
// import { PostFilterHeader } from '@/features/filter-post'; // TODO: SpotFilterHeaderに変更予定
// import { useCurrentUserId } from '@/entities/user'; // TODO: Spot実装時に使用

export function PostPage() {
  // const currentUserId = useCurrentUserId(); // TODO: Spot実装時に使用

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-gray-600 text-center">
          このページは現在開発中です。{'\n'}
          Spotアーキテクチャへの移行後に実装予定です。
        </Text>
      </View>
    </SafeAreaView>
  );
}
