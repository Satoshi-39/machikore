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
import { Loading, ImageViewerModal } from '@/shared/ui';
import { useUser, useUserStats } from '@/entities/user/api';
import { FollowButton } from '@/features/follow-user';

interface MyPageProfileProps {
  userId: string | null;
}

export function MyPageProfile({ userId }: MyPageProfileProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUser(userId ?? '');
  const { data: stats } = useUserStats(userId ?? '');
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  const handleFollowingPress = () => {
    if (userId) {
      router.push(`/(tabs)/mypage/users/${userId}/following`);
    }
  };

  const handleFollowersPress = () => {
    if (userId) {
      router.push(`/(tabs)/mypage/users/${userId}/followers`);
    }
  };

  // ローディング中
  if (isLoading) {
    return (
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Loading variant="inline" />
      </View>
    );
  }

  const visitedMachiCount = stats?.visitedMachiCount ?? 0;
  const followingCount = stats?.followingCount ?? 0;
  const followersCount = stats?.followersCount ?? 0;

  return (
    <View className="bg-white px-4 py-6 border-b border-gray-200">
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

        {/* フォローボタン */}
        <FollowButton targetUserId={userId} />
      </View>

      {/* アバター拡大モーダル */}
      {user?.avatar_url && (
        <ImageViewerModal
          visible={isAvatarModalVisible}
          imageUri={user.avatar_url}
          onClose={() => setIsAvatarModalVisible(false)}
        />
      )}

      {/* ユーザー名 */}
      <Text className="text-xl font-bold text-gray-900 mb-1">
        {user?.display_name || user?.username || 'ユーザー'}
      </Text>
      {user?.username && (
        <Text className="text-sm text-gray-500 mb-3">@{user.username}</Text>
      )}

      {/* 自己紹介 */}
      {user?.bio && (
        <Text className="text-base text-gray-700 leading-5 mb-3">{user.bio}</Text>
      )}

      {/* 統計情報（Instagram/noteスタイル） */}
      <View className="flex-row items-center">
        <Text className="text-sm text-gray-600">
          訪問した街 <Text className="font-bold text-gray-900">{visitedMachiCount}</Text>
          {'  '}·{'  '}
        </Text>
        <TouchableOpacity onPress={handleFollowingPress}>
          <Text className="text-sm text-gray-600">
            フォロー <Text className="font-bold text-gray-900">{followingCount}</Text>
          </Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-600">{'  '}·{'  '}</Text>
        <TouchableOpacity onPress={handleFollowersPress}>
          <Text className="text-sm text-gray-600">
            フォロワー <Text className="font-bold text-gray-900">{followersCount}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
