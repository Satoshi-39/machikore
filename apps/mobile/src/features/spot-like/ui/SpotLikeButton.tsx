/**
 * スポットいいねボタン
 *
 * いいね状態の取得・トグル・表示を一元化した共通コンポーネント
 * N+1問題回避のため、isLikedはJOINで取得して渡すことを推奨
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useToggleSpotLike } from '@/entities/like';

interface SpotLikeButtonProps {
  /** スポットID */
  spotId: string;
  /** 現在のユーザーID（ログイン状態判定用） */
  currentUserId?: string | null;
  /** いいね状態（JOINで取得済みの値を渡す） */
  isLiked: boolean;
  /** いいね数 */
  likesCount: number;
  /** いいね数タップ時のコールバック（ユーザー一覧表示など） */
  onCountPress?: () => void;
  /** ボタンのバリアント */
  variant?: 'icon-only' | 'with-label' | 'with-count' | 'inline';
  /** アイコンサイズ */
  iconSize?: number;
  /** アイコンの色（未いいね時、未指定時はデフォルト色） */
  inactiveColor?: string;
  /** ラベルのクラス名（inline用） */
  labelClassName?: string;
}

export function SpotLikeButton({
  spotId,
  currentUserId,
  isLiked,
  likesCount,
  onCountPress,
  variant = 'with-count',
  iconSize = 18,
  inactiveColor = colors.light["on-surface-variant"],
  labelClassName,
}: SpotLikeButtonProps) {
  const { t } = useI18n();
  const { mutate: toggleLike, isPending } = useToggleSpotLike();

  const handleLikePress = useCallback(
    (e?: any) => {
      e?.stopPropagation?.();
      if (!currentUserId) {
        showLoginRequiredAlert('いいね');
        return;
      }
      if (isPending) return;
      toggleLike({ userId: currentUserId, spotId, isLiked });
    },
    [currentUserId, spotId, toggleLike, isPending, isLiked]
  );

  const iconColor = isLiked ? colors.action["action-like"] : inactiveColor;

  if (variant === 'icon-only') {
    return (
      <Pressable onPress={handleLikePress} disabled={isPending} hitSlop={8}>
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={iconSize}
          color={iconColor}
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
            color={iconColor}
          />
        </View>
        <Text className="text-xs text-on-surface-variant">
          {t('common.like')}
        </Text>
      </Pressable>
    );
  }

  // inline（カルーセル等で横並び配置）
  if (variant === 'inline') {
    return (
      <View className="flex-row items-center gap-2">
        <Pressable onPress={handleLikePress} disabled={isPending} className="active:opacity-70">
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={iconColor}
          />
        </Pressable>
        <Pressable onPress={onCountPress} className="active:opacity-70">
          <Text className={labelClassName ?? "text-xs text-on-surface-variant"}>
            {likesCount > 0 ? likesCount : t('common.like')}
          </Text>
        </Pressable>
      </View>
    );
  }

  // with-count (default)
  return (
    <View className="items-center">
      <View className="flex-row items-center gap-2 h-6">
        <Pressable
          onPress={handleLikePress}
          disabled={isPending}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 0 }}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={iconColor}
          />
        </Pressable>
        <Pressable
          onPress={onCountPress}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
        >
          <Text className="text-lg font-bold text-on-surface">
            {likesCount}
          </Text>
        </Pressable>
      </View>
      <Text className="text-xs text-on-surface-variant">
        {t('common.like')}
      </Text>
    </View>
  );
}
