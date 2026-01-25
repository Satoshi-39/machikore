/**
 * ローディングコンポーネント
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  message?: string;
  variant?: 'fullscreen' | 'inline';
}

export function Loading({ message = '読み込み中...', variant = 'fullscreen' }: LoadingProps) {
  if (variant === 'inline') {
    return (
      <View className="flex-row items-center justify-center py-8">
        <ActivityIndicator size="small" className="text-primary" />
        <Text className="ml-3 text-sm text-on-surface-variant">{message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-secondary">
      <ActivityIndicator size="large" className="text-primary" />
      <Text className="mt-3 text-base text-on-surface-variant">{message}</Text>
    </View>
  );
}
