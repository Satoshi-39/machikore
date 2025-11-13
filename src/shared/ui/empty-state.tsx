/**
 * 空状態表示コンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon = '📭' }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-base text-gray-600">{message}</Text>
    </View>
  );
}
