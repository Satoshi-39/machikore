/**
 * ローディングコンポーネント
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '@/shared/config';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = '読み込み中...' }: LoadingProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      <Text className="mt-3 text-base text-gray-600">{message}</Text>
    </View>
  );
}
