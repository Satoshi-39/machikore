/**
 * ローディングコンポーネント
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '@/shared/config';

interface LoadingProps {
  message?: string;
  variant?: 'fullscreen' | 'inline';
}

export function Loading({ message = '読み込み中...', variant = 'fullscreen' }: LoadingProps) {
  if (variant === 'inline') {
    return (
      <View className="flex-row items-center justify-center py-8">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        <Text className="ml-3 text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-muted dark:bg-dark-muted">
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      <Text className="mt-3 text-base text-foreground-secondary dark:text-dark-foreground-secondary">{message}</Text>
    </View>
  );
}
