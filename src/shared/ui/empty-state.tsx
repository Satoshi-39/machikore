/**
 * 空状態表示コンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  message: string;
  icon?: string;
  variant?: 'fullscreen' | 'inline';
}

export function EmptyState({ message, icon = '📭', variant = 'fullscreen' }: EmptyStateProps) {
  if (variant === 'inline') {
    return (
      <View className="py-8 items-center">
        <Text className="text-4xl mb-2">{icon}</Text>
        <Text className="text-sm text-gray-500 text-center">{message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-base text-gray-600">{message}</Text>
    </View>
  );
}
