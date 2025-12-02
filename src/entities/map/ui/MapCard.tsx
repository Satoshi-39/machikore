/**
 * MapCard コンポーネント
 *
 * マップを表示するカード型コンポーネント
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PopupMenu, type PopupMenuItem } from '@/shared/ui';
import { showLoginRequiredAlert } from '@/shared/lib';
import type { MapRow } from '@/shared/types/database.types';
import type { MapWithUser, UUID } from '@/shared/types';
import { useUser } from '@/entities/user';
import { useDeleteMap } from '@/entities/map/api';
import { useCheckMapLiked, useToggleMapLike } from '@/entities/like';

interface MapCardProps {
  map: MapRow | MapWithUser;
  currentUserId?: UUID | null; // 現在ログイン中のユーザーID（自分のマップか判定用）
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onEdit?: (mapId: string) => void;
}

export function MapCard({ map, currentUserId, onPress, onUserPress, onEdit }: MapCardProps) {
  // JOINで取得済みのuser情報があれば使う、なければAPIから取得
  const embeddedUser = 'user' in map ? map.user : null;
  const { data: fetchedUser } = useUser(embeddedUser ? null : map.user_id);
  const user = embeddedUser || fetchedUser;
  const avatarUri = (user?.avatar_url as string | null | undefined) ?? undefined;

  const { mutate: deleteMap, isPending: isDeleting } = useDeleteMap();
  const { data: isLiked = false } = useCheckMapLiked(currentUserId, map.id);
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();
  const isOwner = currentUserId && map.user_id === currentUserId;

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isTogglingLike) return;
    toggleLike({ userId: currentUserId, mapId: map.id });
  };

  const handleDelete = () => {
    Alert.alert(
      'マップを削除',
      'このマップと含まれるすべてのスポットを削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteMap(map.id),
        },
      ]
    );
  };

  const menuItems: PopupMenuItem[] = useMemo(() => [
    {
      id: 'edit',
      label: '編集',
      icon: 'create-outline',
      onPress: () => onEdit?.(map.id),
    },
    {
      id: 'delete',
      label: '削除',
      icon: 'trash-outline',
      destructive: true,
      onPress: handleDelete,
    },
  ], [map.id, onEdit]);

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border-b border-gray-200 p-4"
    >
      {/* ユーザーアイコンとヘッダー */}
      <View className="flex-row items-center mb-3">
        {/* アイコン（タップでプロフィールへ） */}
        <Pressable onPress={() => onUserPress?.(map.user_id)}>
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
        </Pressable>

        {/* ユーザー名（タップでプロフィールへ） */}
        <View className="flex-1">
          <Pressable onPress={() => onUserPress?.(map.user_id)} className="self-start">
            <Text className="text-sm font-semibold text-gray-800">
              {user?.display_name || user?.username || 'ユーザー'}
            </Text>
          </Pressable>
        </View>

        {/* 三点リーダーメニュー（自分のマップのみ） */}
        {isOwner && !isDeleting && (
          <PopupMenu items={menuItems} triggerColor={colors.text.secondary} />
        )}
      </View>

      {/* サムネイル画像 */}
      {map.thumbnail_url && (
        <Image
          source={{ uri: map.thumbnail_url }}
          className="w-full h-40 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}

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

        {/* いいねボタン */}
        <Pressable
          onPress={handleLikePress}
          className="flex-row items-center"
          disabled={isTogglingLike}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={16}
            color={isLiked ? '#EF4444' : colors.text.secondary}
          />
          <Text className="text-sm text-gray-500 ml-1">
            {map.likes_count ?? 0}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
