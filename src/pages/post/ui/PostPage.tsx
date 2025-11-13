/**
 * ログページ（投稿一覧）
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostList } from '@/widgets/post-list';
import { CreatePostModal } from '@/widgets/create-post';
import { PostFilterHeader } from '@/features/post';
import { FAB } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';

export function PostPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentUserId = useCurrentUserId();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-1">
        <PostFilterHeader />
        <PostList userId={currentUserId} />
        <FAB
          onPress={() => setIsModalVisible(true)}
          icon="create-outline"
          color={colors.primary.DEFAULT}
        />
      </View>

      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}
