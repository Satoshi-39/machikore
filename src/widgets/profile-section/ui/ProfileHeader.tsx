/**
 * プロフィールヘッダーウィジェット
 *
 * ユーザー情報（アバター、名前、自己紹介）を表示
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface ProfileHeaderProps {
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export function ProfileHeader({
  username,
  displayName,
  bio,
  avatarUrl,
}: ProfileHeaderProps) {
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
        <Text className="text-base text-gray-700 leading-5">{bio}</Text>
      )}
    </View>
  );
}
