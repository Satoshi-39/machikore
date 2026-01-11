/**
 * ブックマーク（保存）ボタン
 *
 * スポットをフォルダに保存する機能を提供
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  currentUserId?: string | null;
  /** ボタン押下時のコールバック（フォルダ選択モーダル表示など） */
  onPress: () => void;
  /** 処理中かどうか */
  isPending?: boolean;
  /** ボタンのバリアント */
  variant?: 'icon-only' | 'with-label';
  /** アイコンサイズ */
  iconSize?: number;
}

export function BookmarkButton({
  isBookmarked,
  currentUserId,
  onPress,
  isPending = false,
  variant = 'with-label',
  iconSize = 18,
}: BookmarkButtonProps) {
  const { t } = useI18n();

  const handlePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    onPress();
  }, [currentUserId, onPress]);

  const iconColor = isBookmarked ? colors.primary.DEFAULT : colors.text.secondary;

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handlePress} disabled={isPending} hitSlop={8}>
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={iconSize}
          color={iconColor}
        />
      </Pressable>
    );
  }

  // with-label (default)
  return (
    <Pressable
      onPress={handlePress}
      disabled={isPending}
      className="items-center"
    >
      <View className="flex-row items-center justify-center h-6">
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={iconSize}
          color={iconColor}
        />
      </View>
      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
        {t('common.save')}
      </Text>
    </Pressable>
  );
}
