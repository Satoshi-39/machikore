/**
 * ローディングコンポーネント
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface LoadingProps {
  message?: string;
  variant?: 'fullscreen' | 'inline';
}

export function Loading({ message, variant = 'fullscreen' }: LoadingProps) {
  const { t } = useI18n();
  const displayMessage = message ?? t('common.loading');
  if (variant === 'inline') {
    return (
      <View className="flex-row items-center justify-center py-8">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        <Text className="ml-3 text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{displayMessage}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-surface dark:bg-dark-surface">
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      <Text className="mt-3 text-base text-foreground-secondary dark:text-dark-foreground-secondary">{displayMessage}</Text>
    </View>
  );
}
