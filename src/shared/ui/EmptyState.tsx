/**
 * 空状態表示コンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';

interface EmptyStateProps {
  message: string;
  /** 絵文字アイコン */
  icon?: string;
  /** Ioniconsアイコン名（iconより優先） */
  ionIcon?: keyof typeof Ionicons.glyphMap;
  variant?: 'fullscreen' | 'inline';
}

export function EmptyState({ message, icon, ionIcon = 'search-outline', variant = 'fullscreen' }: EmptyStateProps) {
  const renderIcon = () => {
    if (ionIcon) {
      return (
        <View className="w-20 h-20 rounded-full bg-muted dark:bg-dark-muted items-center justify-center mb-4">
          <Ionicons name={ionIcon} size={40} color={colors.text.secondary} />
        </View>
      );
    }
    return <Text className={variant === 'inline' ? 'text-4xl mb-2' : 'text-6xl mb-4'}>{icon}</Text>;
  };

  if (variant === 'inline') {
    return (
      <View className="py-8 items-center">
        {renderIcon()}
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary text-center">{message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-surface dark:bg-dark-surface">
      {renderIcon()}
      <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary">{message}</Text>
    </View>
  );
}
