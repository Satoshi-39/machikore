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
  textClassName = 'text-on-surface-variant',
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
      toggleLike({ userId: currentUserId, mapId, isLiked });
    },
    [currentUserId, isTogglingLike, toggleLike, mapId, isLiked]
  );

  const handleCountPress = useCallback(
    (e: any) => {
      e.stopPropagation();
      onCountPress?.();
    },
    [onCountPress]
  );

  // onCountPressがない場合は全体を1つのPressableに
  if (!onCountPress) {
    return (
      <Pressable
        onPress={handleLikePress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        disabled={isTogglingLike}
        className="flex-row items-center"
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={size}
          color={isLiked ? '#EF4444' : inactiveColor}
        />
        {showCount && (!hideCountWhenZero || likesCount > 0) && (
          <Text className={`${textClassName} ${textMarginClassName}`}>
            {likesCount}
          </Text>
        )}
      </Pressable>
    );
  }

  // onCountPressがある場合は別々のPressable（hitSlopは重複しないよう2pxずつ）
  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={handleLikePress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 2 }}
        disabled={isTogglingLike}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={size}
          color={isLiked ? '#EF4444' : inactiveColor}
        />
      </Pressable>
      {showCount && (!hideCountWhenZero || likesCount > 0) && (
        <View className={textMarginClassName}>
          <Pressable
            onPress={handleCountPress}
            hitSlop={{ top: 8, bottom: 8, left: 2, right: 8 }}
          >
            <Text className={textClassName}>
              {likesCount}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
