/**
 * マップいいねボタン
 *
 * いいね状態の取得・トグル・表示を一元化した共通コンポーネント
 * N+1問題回避のため、isLikedはJOINで取得して渡すことを推奨
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useToggleMapLike } from '@/entities/like';

interface MapLikeButtonProps {
  /** マップID */
  mapId: string;
  /** 現在のユーザーID（ログイン状態判定用） */
  currentUserId?: string | null;
  /** いいね数（表示する場合） */
  likesCount?: number;
  /** アイコンサイズ */
  size?: number;
  /** いいね数を表示するか */
  showCount?: boolean;
  /** いいね数が0の時に非表示にするか */
  hideCountWhenZero?: boolean;
  /** いいね数のタップハンドラー（いいねユーザー一覧を開く等） */
  onCountPress?: () => void;
  /** 未いいね時のアイコン色 */
  inactiveColor?: string;
  /** いいね状態（JOINで取得済みの値を渡す） */
  isLiked?: boolean;
  /** テキストのカスタムクラス名 */
  textClassName?: string;
  /** アイコンとテキストの間隔（ml-X形式） */
  textMarginClassName?: string;
}

export function MapLikeButton({
  mapId,
  currentUserId,
  likesCount = 0,
  size = 18,
  showCount = true,
  hideCountWhenZero = false,
  onCountPress,
  inactiveColor = colors.text.secondary,
  isLiked = false,
  textClassName = 'text-foreground-secondary dark:text-dark-foreground-secondary',
  textMarginClassName = 'ml-3',
}: MapLikeButtonProps) {
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleMapLike();

  const handleLikePress = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!currentUserId) {
        showLoginRequiredAlert('いいね');
        return;
      }
      if (isTogglingLike) return;
      toggleLike({ userId: currentUserId, mapId });
    },
    [currentUserId, isTogglingLike, toggleLike, mapId]
  );

  const handleCountPress = useCallback(
    (e: any) => {
      e.stopPropagation();
      onCountPress?.();
    },
    [onCountPress]
  );

  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={handleLikePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: showCount ? 0 : 10 }}
        disabled={isTogglingLike}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={size}
          color={isLiked ? '#EF4444' : inactiveColor}
        />
      </Pressable>
      {showCount && (!hideCountWhenZero || likesCount > 0) && (
        <Pressable
          onPress={onCountPress ? handleCountPress : handleLikePress}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
        >
          <Text
            className={`${textClassName} ${textMarginClassName}`}
            style={{ fontSize: size * 0.78 }}
          >
            {likesCount}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
