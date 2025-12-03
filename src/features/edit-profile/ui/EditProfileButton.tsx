/**
 * プロフィール編集ボタン
 *
 * 自分のプロフィール編集画面へ遷移するボタン
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';

export function EditProfileButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/edit-profile');
  };

  return (
    <Pressable
      onPress={handlePress}
      className="px-4 py-2 rounded-full border border-gray-300 active:bg-gray-50"
    >
      <Text className="text-sm font-semibold text-gray-700">
        プロフィール編集
      </Text>
    </Pressable>
  );
}
