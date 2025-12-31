/**
 * 汎用ボタン
 *
 * variant で見た目を切り替え可能
 * - primary: 塗りつぶし背景（メインアクション用）
 * - secondary: ボーダーのみ（サブアクション用）
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDarkMode = useIsDarkMode();
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';

  // テーマに応じた色
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const shadowStyle: ViewStyle = (isPrimary || isDestructive) && !isDisabled
    ? {
        shadowColor: isDestructive ? '#EF4444' : colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }
    : {};

  // クラス名を決定
  let containerClass: string;
  let textClass: string;

  if (isDestructive && isDisabled) {
    containerClass = 'py-4 rounded-full items-center bg-gray-300 dark:bg-gray-600';
    textClass = 'font-semibold text-base text-white';
  } else if (isDestructive && !isDisabled) {
    containerClass = 'py-4 rounded-full items-center bg-red-500';
    textClass = 'font-semibold text-base text-white';
  } else if (isPrimary && isDisabled) {
    containerClass = 'py-4 rounded-full items-center bg-gray-300 dark:bg-gray-600';
    textClass = 'font-semibold text-base text-white';
  } else if (isPrimary && !isDisabled) {
    containerClass = 'py-4 rounded-full items-center bg-primary';
    textClass = 'font-semibold text-base text-white';
  } else if (!isPrimary && !isDestructive && isDisabled) {
    containerClass = 'py-4 rounded-full items-center border-2 border-gray-300 dark:border-gray-600';
    textClass = 'font-semibold text-base text-gray-400 dark:text-gray-500';
  } else {
    // secondary && !isDisabled
    // EditProfileButtonと同じ方法: light/dark両方を明示的に指定
    containerClass = 'py-4 rounded-full items-center border-2 border-primary dark:border-dark-foreground';
    textClass = 'font-semibold text-base text-primary dark:text-dark-foreground';
  }

  const indicatorColor = (isPrimary || isDestructive)
    ? 'white'
    : (isDarkMode ? themeColors.foreground : colors.primary.DEFAULT);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={containerClass}
      style={shadowStyle}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text className={textClass}>{title}</Text>
      )}
    </Pressable>
  );
}
