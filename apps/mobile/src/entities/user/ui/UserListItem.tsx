/**
 * UserListItem コンポーネント
 *
 * ユーザーを表示するリストアイテム
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { UserAvatar } from '@/shared/ui';

/**
 * UserListItemで必要な最小限のユーザー情報
 */
interface UserListItemUser {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
}

interface UserListItemProps {
  user: UserListItemUser;
  onPress?: () => void;
}

export function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border p-4 flex-row items-center"
    >
      {/* アバター */}
      <UserAvatar
        url={user.avatar_url}
        alt={user.display_name || user.username || 'User'}
        className="w-12 h-12 mr-3"
      />

      {/* ユーザー情報 */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
          {user.display_name || user.username || 'ユーザー'}
        </Text>
        {user.username && (
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            @{user.username}
          </Text>
        )}
        {user.bio && (
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1" numberOfLines={1}>
            {user.bio}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
