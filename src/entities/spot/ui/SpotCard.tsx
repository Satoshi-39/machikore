/**
 * SpotCard コンポーネント
 *
 * スポットを表示するカード型コンポーネント
 * ローカルSQLiteデータとSupabase JOINデータの両方に対応
 */

import React from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { SpotWithMasterSpot } from '@/shared/types/database.types';
import type { SpotWithDetails, UUID } from '@/shared/types';
import { getRelativeSpotTime } from '@/entities/spot/model/helpers';
import { useToggleLike, useCheckUserLiked, useSpotImages } from '@/entities/spot/api';
import { useUser } from '@/entities/user';

// Supabase JOINで取得済みのユーザー情報
interface EmbeddedUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

// Supabase JOINで取得済みのmaster_spot情報
interface EmbeddedMasterSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: string | null;
  google_types: string[] | null;
}

interface SpotCardProps {
  // ローカルSQLiteデータまたはSupabase SpotWithDetailsデータ
  spot: SpotWithMasterSpot | SpotWithDetails;
  userId: UUID;
  machiName?: string;
  onPress?: () => void;
  // Supabase JOINで既に取得済みのデータ（あれば個別fetchをスキップ）
  embeddedUser?: EmbeddedUser | null;
  embeddedMasterSpot?: EmbeddedMasterSpot | null;
}

export function SpotCard({
  spot,
  userId,
  machiName,
  onPress,
  embeddedUser,
  embeddedMasterSpot,
}: SpotCardProps) {
  // embeddedUserがあればuseUserをスキップ
  const { data: fetchedUser } = useUser(embeddedUser ? null : spot.user_id);
  const user = embeddedUser || fetchedUser;

  const { data: isLiked = false } = useCheckUserLiked(userId, spot.id);
  const { mutate: toggleLike } = useToggleLike();
  const { data: images = [] } = useSpotImages(spot.id);

  const avatarUri = user?.avatar_url ?? undefined;

  // スポット名の取得（SpotWithDetailsとSpotWithMasterSpotで構造が異なる）
  const getSpotName = (): string => {
    if (spot.custom_name) return spot.custom_name;
    // SpotWithDetails型の場合
    if ('master_spot' in spot && spot.master_spot?.name) {
      return spot.master_spot.name;
    }
    // SpotWithMasterSpot型の場合
    if ('name' in spot && spot.name) {
      return spot.name;
    }
    // embeddedMasterSpotがある場合
    if (embeddedMasterSpot?.name) {
      return embeddedMasterSpot.name;
    }
    return '不明なスポット';
  };

  // 住所の取得
  const getAddress = (): string | null => {
    if ('master_spot' in spot && spot.master_spot?.google_formatted_address) {
      return spot.master_spot.google_formatted_address;
    }
    if (embeddedMasterSpot?.google_formatted_address) {
      return embeddedMasterSpot.google_formatted_address;
    }
    return null;
  };

  const spotName = getSpotName();
  const address = getAddress();

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
        📍 {spotName}
      </Text>

      {/* 説明 */}
      {spot.description && (
        <Text className="text-sm text-gray-700 mb-2">
          {spot.description}
        </Text>
      )}

      {/* 画像 */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2 -mx-1"
        >
          {images.map((image) => (
            <Image
              key={image.id}
              source={{ uri: image.cloud_path || image.local_path || '' }}
              className="w-24 h-24 rounded-lg mx-1"
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* 住所または街情報 */}
      {(address || machiName) && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
          <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
            {address || machiName}
          </Text>
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
