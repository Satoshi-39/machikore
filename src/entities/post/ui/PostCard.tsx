/**
 * PostCard コンポーネント
 *
 * 投稿を表示するカード型コンポーネント
 */

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { PostRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';
import { getRelativePostTime } from '@/entities/post/model/helpers';
import { useToggleLike, useCheckUserLiked } from '@/entities/post/api';
import { useUser } from '@/entities/user';

interface PostCardProps {
  post: PostRow;
  userId: UUID;
  stationName?: string;
  onPress?: () => void;
}

export function PostCard({ post, userId, stationName, onPress }: PostCardProps) {
  const { data: isLiked = false } = useCheckUserLiked(userId, post.id);
  const { mutate: toggleLike } = useToggleLike();
  const { data: user } = useUser(post.user_id);

  // データベースのavatar_urlにはファイルシステムのURIが保存されている
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    toggleLike({ userId, postId: post.id });
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border-b border-gray-200 p-4"
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-3">
            <Ionicons name="person" size={20} color={colors.gray[500]} />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-800">
            {user?.display_name || user?.username || 'ユーザー'}
          </Text>
          <Text className="text-xs text-gray-500">
            {getRelativePostTime(post.created_at)}
          </Text>
        </View>
      </View>

      {/* 投稿内容 */}
      <Text className="text-base text-gray-900 mb-2">
        {post.is_auto_generated === 1 && '📍 '}
        {post.content}
      </Text>

      {/* 街情報 */}
      {stationName && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text className="text-sm text-gray-600 ml-1">{stationName}</Text>
        </View>
      )}

      {/* フッター情報 */}
      <View className="flex-row items-center justify-end mt-2">
        {/* いいね・コメント数 */}
        <View className="flex-row items-center gap-4">
          {/* いいね */}
          <Pressable onPress={handleLikePress} className="flex-row items-center">
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? colors.danger : colors.text.secondary}
            />
            <Text className="text-sm text-gray-600 ml-1">
              {post.likes_count}
            </Text>
          </Pressable>

          {/* コメント */}
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
            <Text className="text-sm text-gray-600 ml-1">
              {post.comments_count}
            </Text>
          </View>
        </View>
      </View>

      {/* 下書きバッジ */}
      {post.is_draft === 1 && (
        <View className="absolute top-4 right-4">
          <View className="bg-yellow-100 px-2 py-1 rounded">
            <Text className="text-xs text-yellow-800 font-medium">下書き</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
