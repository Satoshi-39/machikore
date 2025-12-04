/**
 * マイページプロフィールウィジェット
 *
 * ユーザーのプロフィール情報と統計を表示
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { Loading, ImageViewerModal } from '@/shared/ui';
import { useUser, useUserStats, useCurrentUserId } from '@/entities/user';
import { FollowButton } from '@/features/follow-user';
import { EditProfileButton } from '@/features/edit-profile';

interface MyPageProfileProps {
  userId: string | null;
}

export function MyPageProfile({ userId }: MyPageProfileProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const { data: user, isLoading } = useUser(userId ?? '');
  const { data: stats } = useUserStats(userId ?? '');
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // 自分のプロフィールかどうか
  const isOwnProfile = currentUserId && userId && currentUserId === userId;

  const handleFollowingPress = () => {
    if (userId) {
      router.push(`/(tabs)/${currentTab}/users/${userId}/following` as any);
    }
  };

  const handleFollowersPress = () => {
    if (userId) {
      router.push(`/(tabs)/${currentTab}/users/${userId}/followers` as any);
    }
  };


  // ローディング中
  if (isLoading) {
    return (
      <View className="bg-surface dark:bg-dark-surface px-4 py-6 border-b border-border dark:border-dark-border">
        <Loading variant="inline" />
      </View>
    );
  }

  const visitedMachiCount = stats?.visitedMachiCount ?? 0;
  const followingCount = stats?.followingCount ?? 0;
  const followersCount = stats?.followersCount ?? 0;

  return (
    <View className="bg-surface dark:bg-dark-surface px-4 py-6 border-b border-border dark:border-dark-border">
      {/* アバターとフォローボタン */}
      <View className="flex-row items-center justify-between mb-4">
        {/* アバター */}
        {user?.avatar_url ? (
          <Pressable onPress={() => setIsAvatarModalVisible(true)}>
            <Image
              source={{ uri: user.avatar_url }}
              className="w-20 h-20 rounded-full"
            />
          </Pressable>
        ) : (
          <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center">
            <Ionicons name="person" size={40} color={colors.gray[400]} />
          </View>
        )}

        {/* プロフィール編集 or フォローボタン */}
        {isOwnProfile ? (
          <EditProfileButton />
        ) : (
          <FollowButton targetUserId={userId} />
        )}
      </View>

      {/* アバター拡大モーダル */}
      {user?.avatar_url && (
        <ImageViewerModal
          visible={isAvatarModalVisible}
          images={[user.avatar_url]}
          onClose={() => setIsAvatarModalVisible(false)}
        />
      )}

      {/* ユーザー名 */}
      <Text className="text-xl font-bold text-foreground dark:text-dark-foreground mb-1">
        {user?.display_name || user?.username || 'ユーザー'}
      </Text>
      {user?.username && (
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">@{user.username}</Text>
      )}

      {/* 自己紹介 */}
      {user?.bio && (
        <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary leading-5 mb-3">{user.bio}</Text>
      )}

      {/* 統計情報（Instagram/noteスタイル） */}
      <View className="flex-row items-center">
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
          訪問した街 <Text className="font-bold text-foreground dark:text-dark-foreground">{visitedMachiCount}</Text>
          {'  '}·{'  '}
        </Text>
        <TouchableOpacity onPress={handleFollowingPress}>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            フォロー <Text className="font-bold text-foreground dark:text-dark-foreground">{followingCount}</Text>
          </Text>
        </TouchableOpacity>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{'  '}·{'  '}</Text>
        <TouchableOpacity onPress={handleFollowersPress}>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            フォロワー <Text className="font-bold text-foreground dark:text-dark-foreground">{followersCount}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
