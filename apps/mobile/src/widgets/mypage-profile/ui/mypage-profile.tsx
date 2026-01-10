/**
 * マイページプロフィールウィジェット
 *
 * ユーザーのプロフィール情報と統計を表示
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentTab } from '@/shared/lib';
import { ProfileSkeleton, ImageViewerModal, UserAvatar } from '@/shared/ui';
import { useUser, useUserStats, useCurrentUserId } from '@/entities/user';
import { FollowButton } from '@/features/follow-user';
import { EditProfileButton } from '@/features/edit-profile';
import { useI18n } from '@/shared/lib/i18n';

interface MyPageProfileProps {
  userId: string | null;
}

export function MyPageProfile({ userId }: MyPageProfileProps) {
  const { t } = useI18n();
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


  // ローディング中はスケルトンを表示（レイアウトシフト防止）
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const mapsCount = stats?.mapsCount ?? 0;
  const followingCount = stats?.followingCount ?? 0;
  const followersCount = stats?.followersCount ?? 0;

  return (
    <View className="bg-surface dark:bg-dark-surface px-4 py-6 border-b border-border dark:border-dark-border">
      {/* アバターとフォローボタン */}
      <View className="flex-row items-center justify-between mb-4">
        {/* アバター */}
        <Pressable
          onPress={() => user?.avatar_url && setIsAvatarModalVisible(true)}
          disabled={!user?.avatar_url}
        >
          <UserAvatar
            url={user?.avatar_url}
            alt={user?.display_name || user?.username || 'User'}
            className="w-20 h-20"
            iconSize={40}
          />
        </Pressable>

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
        {user?.display_name || user?.username || t('mypage.defaultUser')}
      </Text>
      {user?.username && (
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">@{user.username}</Text>
      )}

      {/* 自己紹介 */}
      {user?.bio && (
        <Text className="text-base text-foreground dark:text-dark-foreground leading-5 mb-3">{user.bio}</Text>
      )}

      {/* 統計情報（Instagram/noteスタイル） */}
      <View className="flex-row items-center">
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
          <Text className="font-bold text-foreground dark:text-dark-foreground">{mapsCount}</Text> {t('profile.maps')}
        </Text>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{'  '}·{'  '}</Text>
        <TouchableOpacity onPress={handleFollowingPress}>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            <Text className="font-bold text-foreground dark:text-dark-foreground">{followingCount}</Text> {t('profile.following')}
          </Text>
        </TouchableOpacity>
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{'  '}·{'  '}</Text>
        <TouchableOpacity onPress={handleFollowersPress}>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
            <Text className="font-bold text-foreground dark:text-dark-foreground">{followersCount}</Text> {t('profile.followers')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
