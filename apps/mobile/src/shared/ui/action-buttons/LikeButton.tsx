/**
 * いいねボタン
 *
 * スポットへのいいね機能を提供
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useToggleSpotLike } from '@/entities/like';

interface LikeButtonProps {
  spotId: string;
  currentUserId?: string | null;
  isLiked: boolean;
  likesCount: number;
  /** いいね数タップ時のコールバック（ユーザー一覧表示など） */
  onCountPress?: () => void;
  /** ボタンのバリアント */
  variant?: 'icon-only' | 'with-label' | 'with-count' | 'inline';
  /** アイコンサイズ */
  iconSize?: number;
  /** アイコンの色（inline用、未指定時はデフォルト色） */
  iconColor?: string;
  /** ラベルのクラス名（inline用） */
  labelClassName?: string;
}

export function LikeButton({
  spotId,
  currentUserId,
  isLiked,
  likesCount,
  onCountPress,
  variant = 'with-count',
  iconSize = 18,
  iconColor,
  labelClassName,
}: LikeButtonProps) {
  const { t } = useI18n();
  const { mutate: toggleLike, isPending } = useToggleSpotLike();

  const handleLikePress = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert('いいね');
      return;
    }
    if (isPending) return;
    toggleLike({ userId: currentUserId, spotId });
  }, [currentUserId, spotId, toggleLike, isPending]);

  const defaultIconColor = isLiked ? colors.danger : colors.text.secondary;
  const finalIconColor = iconColor ?? defaultIconColor;

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handleLikePress} disabled={isPending} hitSlop={8}>
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={iconSize}
          color={finalIconColor}
        />
      </Pressable>
    );
  }

  if (variant === 'with-label') {
    return (
      <Pressable onPress={handleLikePress} disabled={isPending} className="items-center">
        <View className="flex-row items-center justify-center h-6">
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={finalIconColor}
          />
        </View>
        <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
          {t('common.like')}
        </Text>
      </Pressable>
    );
  }

  // inline（カルーセル等で横並び配置）
  if (variant === 'inline') {
    return (
      <View className="flex-row items-center">
        <Pressable onPress={handleLikePress} disabled={isPending} className="active:opacity-70">
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={isLiked ? colors.danger : (iconColor ?? colors.text.secondary)}
          />
        </Pressable>
        <Pressable onPress={onCountPress} className="active:opacity-70 ml-1">
          <Text className={labelClassName ?? "text-xs text-foreground-secondary dark:text-dark-foreground-secondary"}>
            {likesCount > 0 ? likesCount : t('common.like')}
          </Text>
        </Pressable>
      </View>
    );
  }

  // with-count (default)
  return (
    <View className="items-center">
      <View className="flex-row items-center h-6">
        <Pressable
          onPress={handleLikePress}
          disabled={isPending}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 5 }}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={finalIconColor}
          />
        </Pressable>
        <Pressable
          onPress={onCountPress}
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
        >
          <Text className="text-lg font-bold text-foreground dark:text-dark-foreground ml-1">
            {likesCount}
          </Text>
        </Pressable>
      </View>
      <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
        {t('common.like')}
      </Text>
    </View>
  );
}
