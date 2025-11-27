/**
 * UserListItem コンポーネント
 *
 * ユーザーを表示するリストアイテム
 */

import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import type { UserRow } from '@/shared/types/database.types';

interface UserListItemProps {
  user: UserRow;
  onPress?: () => void;
}

export function UserListItem({ user, onPress }: UserListItemProps) {
  const avatarUri = (user.avatar_url as string | null | undefined) ?? undefined;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border-b border-gray-200 p-4 flex-row items-center"
    >
      {/* アバター */}
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          className="w-12 h-12 rounded-full mr-3"
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center mr-3">
          <Ionicons name="person" size={24} color={colors.gray[500]} />
        </View>
      )}

      {/* ユーザー情報 */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {user.display_name || user.username || 'ユーザー'}
        </Text>
        {user.username && (
          <Text className="text-sm text-gray-500">
            @{user.username}
          </Text>
        )}
        {user.bio && (
          <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
            {user.bio}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
