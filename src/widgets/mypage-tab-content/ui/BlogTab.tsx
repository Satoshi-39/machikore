/**
 * マイページ ブログタブ
 *
 * ユーザーが投稿したブログ記事を表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface BlogTabProps {
  userId: string | null;
}

export function BlogTab({ userId }: BlogTabProps) {
  // TODO: ブログデータの取得
  // const { data: blogs } = useUserBlogs(userId);

  // プレースホルダー実装のためuserIdは未使用
  console.log('BlogTab for userId:', userId);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6 py-12">
      <View className="items-center">
        <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Ionicons name="reader" size={40} color={colors.text.secondary} />
        </View>
        <Text className="text-base font-semibold text-gray-900 mb-2">
          ブログ記事
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          ブログ機能は今後実装予定です
        </Text>
      </View>
    </View>
  );
}
