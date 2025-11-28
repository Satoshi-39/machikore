/**
 * MapCard コンポーネント
 *
 * マップを表示するカード型コンポーネント
 */

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { MapRow } from '@/shared/types/database.types';
import type { MapWithUser } from '@/shared/types';
import { useUser } from '@/entities/user';

interface MapCardProps {
  map: MapRow | MapWithUser;
  onPress?: () => void;
}

export function MapCard({ map, onPress }: MapCardProps) {
  // JOINで取得済みのuser情報があれば使う、なければAPIから取得
  const embeddedUser = 'user' in map ? map.user : null;
  const { data: fetchedUser } = useUser(embeddedUser ? null : map.user_id);
  const user = embeddedUser || fetchedUser;
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

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
        </View>
      </View>

      {/* マップ名 */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="map" size={18} color={colors.primary.DEFAULT} />
        <Text className="text-base font-semibold text-gray-900 ml-2">
          {map.name}
        </Text>
      </View>

      {/* 説明 */}
      {map.description && (
        <Text className="text-sm text-gray-700 mb-2" numberOfLines={2}>
          {map.description}
        </Text>
      )}

      {/* フッター情報 */}
      <View className="flex-row items-center justify-between mt-2">
        {/* スポット数 */}
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text className="text-sm text-gray-500 ml-1">
            {map.spots_count ?? 0} スポット
          </Text>
        </View>

        {/* いいね数 */}
        <View className="flex-row items-center">
          <Ionicons name="heart-outline" size={16} color={colors.text.secondary} />
          <Text className="text-sm text-gray-500 ml-1">
            {map.likes_count ?? 0}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
