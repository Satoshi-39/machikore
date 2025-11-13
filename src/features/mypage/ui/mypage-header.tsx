/**
 * マイページヘッダー
 *
 * マイページ専用のヘッダーバー（タイトル中央、右側に設定アイコン）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface MyPageHeaderProps {
  onSettingsPress: () => void;
}

export function MyPageHeader({ onSettingsPress }: MyPageHeaderProps) {
  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center justify-center relative">
      <Text className="text-xl font-bold text-gray-900">マイページ</Text>
      <Pressable
        onPress={onSettingsPress}
        className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 absolute right-4"
      >
        <Ionicons name="settings-outline" size={24} color={colors.text.secondary} />
      </Pressable>
    </View>
  );
}
