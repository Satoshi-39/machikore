/**
 * SpotCard コンポーネント
 *
 * スポットを表示するカード型コンポーネント
 */

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { SpotRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';
import { getRelativeSpotTime } from '@/entities/spot/model/helpers';
import { useToggleLike, useCheckUserLiked } from '@/entities/spot/api';
import { useUser } from '@/entities/user';

interface SpotCardProps {
  spot: SpotRow;
  userId: UUID;
  machiName?: string;
  onPress?: () => void;
}

export function SpotCard({ spot, userId, machiName, onPress }: SpotCardProps) {
  const { data: isLiked = false } = useCheckUserLiked(userId, spot.id);
  const { mutate: toggleLike } = useToggleLike();
  const { data: user } = useUser(spot.user_id);

  // データベースのavatar_urlにはファイルシステムのURIが保存されている
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    toggleLike({ userId, spotId: spot.id });
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
            {getRelativeSpotTime(spot.created_at)}
          </Text>
        </View>
      </View>

      {/* スポット名 */}
      <Text className="text-base font-semibold text-gray-900 mb-2">
        📍 {spot.name}
      </Text>

      {/* メモ */}
      {spot.memo && (
        <Text className="text-sm text-gray-700 mb-2">
          {spot.memo}
        </Text>
      )}

      {/* 街情報 */}
      {machiName && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text className="text-sm text-gray-600 ml-1">{machiName}</Text>
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
              {spot.likes_count}
            </Text>
          </Pressable>

          {/* コメント */}
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text.secondary} />
            <Text className="text-sm text-gray-600 ml-1">
              {spot.comments_count}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
