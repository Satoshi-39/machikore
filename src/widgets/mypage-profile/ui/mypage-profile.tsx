/**
 * マイページプロフィールウィジェット
 *
 * ユーザーのプロフィール情報と統計を表示
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useUser, useUserStats } from '@/entities/user/api';

interface MyPageProfileProps {
  userId: string | null;
}

export function MyPageProfile({ userId }: MyPageProfileProps) {
  // userIdがnullの場合は空の状態を表示
  const { data: user } = useUser(userId ?? '');
  const { data: stats } = useUserStats(userId ?? '');

  // 型安全な値の抽出
  const username: string = (user?.username as string | undefined) ?? 'machikore_user';
  const displayName: string = (user?.display_name as string | null | undefined) ?? 'まちコレユーザー';
  const bio: string = (user?.bio as string | null | undefined) ?? '街を巡るのが好きです。色々な場所を訪れて、思い出を記録しています。';
  const avatarUrl: string | undefined = (user?.avatar_url as string | null | undefined) ?? undefined;

  const visitedMachiCount = stats?.visitedMachiCount ?? 0;
  const followingCount = stats?.followingCount ?? 0;
  const followersCount = stats?.followersCount ?? 0;

  return (
    <View className="bg-white px-4 py-6 border-b border-gray-200">
      {/* アバター */}
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          className="w-20 h-20 rounded-full mb-4"
        />
      ) : (
        <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-4">
          <Ionicons name="person" size={40} color={colors.gray[400]} />
        </View>
      )}

      {/* ユーザー名 */}
      <Text className="text-xl font-bold text-gray-900 mb-1">
        {displayName || username}
      </Text>
      <Text className="text-sm text-gray-500 mb-3">@{username}</Text>

      {/* 自己紹介 */}
      {bio && (
        <Text className="text-base text-gray-700 leading-5 mb-3">{bio}</Text>
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
