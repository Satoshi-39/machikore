/**
 * エラー表示コンポーネント
 *
 * variant:
 * - fullscreen: 画面中央にアイコン + メッセージ + リトライボタン
 * - inline: セクション内に小さくアイコン + メッセージ（固定高さ h-32）
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface ErrorViewProps {
  error?: Error | string;
  message?: string;
  onRetry?: () => void;
  variant?: 'fullscreen' | 'inline';
}

export function ErrorView({ error, message, onRetry, variant = 'fullscreen' }: ErrorViewProps) {
  const { t } = useI18n();

  const displayMessage =
    message ??
    (error ? (typeof error === 'string' ? error : error.message) : t('errors.loadFailed'));

  if (variant === 'inline') {
    return (
      <View className="h-32 items-center justify-center px-5">
        <Ionicons
          name="alert-circle-outline"
          size={iconSizeNum.lg}
          className="text-on-surface-variant"
        />
        <Text className="text-sm text-on-surface-variant text-center mt-2">
          {displayMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-surface px-6">
      <Ionicons
        name="alert-circle-outline"
        size={iconSizeNum['3xl']}
        className="text-on-surface-variant"
      />
      <Text className="text-on-surface text-center mt-4 mb-6">
        {displayMessage}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-primary py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">{t('common.retry')}</Text>
        </Pressable>
      )}
    </View>
  );
}
