/**
 * 街に紐づく投稿リスト（デフォルトマップ詳細カード用）
 *
 * default-map 専用の内部コンポーネント
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { usePostsByVisit } from '@/entities/post/api';
import { getRelativePostTime } from '@/entities/post/model';
import type { UUID } from '@/shared/types';

interface MachiPostListProps {
  visitId: UUID | null;
}

export function MachiPostList({ visitId }: MachiPostListProps) {
  const { data: posts, isLoading } = usePostsByVisit(visitId || '');

  if (!visitId || isLoading) {
    return null;
  }

  if (!posts || posts.length === 0) {
    return (
      <View className="bg-gray-50 rounded-lg p-3">
        <View className="flex-row items-center">
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text className="text-sm text-gray-600 ml-2">
            まだ投稿がありません
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-gray-50 rounded-lg p-3">
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="chatbubble-ellipses"
          size={20}
          color={colors.primary.DEFAULT}
        />
        <Text className="text-sm font-semibold text-gray-900 ml-2">
          この街の投稿（{posts.length}件）
        </Text>
      </View>

      <ScrollView
        className="max-h-40"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {posts.map((post) => (
          <View
            key={post.id}
            className="bg-white rounded-lg p-2 mb-2 border border-gray-200"
          >
            <Text className="text-sm text-gray-900 mb-1" numberOfLines={2}>
              {post.content}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-500">
                {getRelativePostTime(post.created_at)}
              </Text>
              {post.is_auto_generated === 1 && (
                <View className="bg-blue-100 px-2 py-0.5 rounded">
                  <Text className="text-xs text-blue-700">自動</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
