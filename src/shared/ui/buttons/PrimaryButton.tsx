/**
 * プライマリボタン
 *
 * アプリ全体で使用するメインアクションボタン
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '@/shared/config';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  const shadowStyle: ViewStyle = !isDisabled
    ? {
        shadowColor: colors.primary.DEFAULT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }
    : {};

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`py-4 rounded-full items-center ${
        isDisabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary'
      }`}
      style={shadowStyle}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="font-semibold text-base text-white">{title}</Text>
      )}
    </Pressable>
  );
}
