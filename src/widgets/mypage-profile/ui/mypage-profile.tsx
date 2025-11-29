/**
 * マイページプロフィールウィジェット
 *
 * ユーザーのプロフィール情報と統計を表示
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading } from '@/shared/ui';
import { useUser, useUserStats } from '@/entities/user/api';

interface MyPageProfileProps {
  userId: string | null;
}

export function MyPageProfile({ userId }: MyPageProfileProps) {
  const { data: user, isLoading } = useUser(userId ?? '');
  const { data: stats } = useUserStats(userId ?? '');

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
      {/* アバター */}
      {user?.avatar_url ? (
        <Image
          source={{ uri: user.avatar_url }}
          className="w-20 h-20 rounded-full mb-4"
        />
      ) : (
        <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-4">
          <Ionicons name="person" size={40} color={colors.gray[400]} />
        </View>
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
          フォロー <Text className="font-bold text-gray-900">{followingCount}</Text>
          {'  '}·{'  '}
          フォロワー <Text className="font-bold text-gray-900">{followersCount}</Text>
        </Text>
      </View>
    </View>
  );
}
