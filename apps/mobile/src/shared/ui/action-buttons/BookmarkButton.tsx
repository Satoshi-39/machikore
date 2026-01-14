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
  variant?: 'icon-only' | 'with-label' | 'inline';
  /** アイコンサイズ */
  iconSize?: number;
  /** アイコンの色（inline用、未指定時はデフォルト色） */
  iconColor?: string;
  /** ラベルのクラス名（inline用） */
  labelClassName?: string;
}

export function BookmarkButton({
  isBookmarked,
  currentUserId,
  onPress,
  isPending = false,
  variant = 'with-label',
  iconSize = 18,
  iconColor,
  labelClassName,
}: BookmarkButtonProps) {
  const { t } = useI18n();

  const handlePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('保存');
      return;
    }
    onPress();
  }, [currentUserId, onPress]);

  // アイコン色：渡された色があればそれを使い、なければデフォルトのグレー
  const finalIconColor = iconColor ?? colors.text.secondary;

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handlePress} disabled={isPending} hitSlop={8}>
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={iconSize}
          color={finalIconColor}
        />
      </Pressable>
    );
  }

  // inline（カルーセル等で横並び配置）
  if (variant === 'inline') {
    return (
      <Pressable onPress={handlePress} disabled={isPending} className="flex-row items-center active:opacity-70">
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={iconSize}
          color={finalIconColor}
        />
        <Text className={labelClassName ?? "text-xs text-foreground-secondary dark:text-dark-foreground-secondary ml-1"}>
          {t('common.save')}
        </Text>
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
          color={finalIconColor}
        />
      </View>
      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
        {t('common.save')}
      </Text>
    </Pressable>
  );
}
