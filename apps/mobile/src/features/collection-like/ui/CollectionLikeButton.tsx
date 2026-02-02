/**
 * コレクションいいねボタン
 *
 * いいね状態の取得・トグル・表示を一元化した共通コンポーネント
 * N+1問題回避のため、isLikedはJOINで取得して渡すことを推奨
 */

import React, { useCallback } from 'react';
import { Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useToggleCollectionLike } from '@/entities/like';

interface CollectionLikeButtonProps {
  /** コレクションID */
  collectionId: string;
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
  /** 未いいね時のアイコン色 */
  inactiveColor?: string;
  /** いいね状態（JOINで取得済みの値を渡す） */
  isLiked?: boolean;
  /** テキストのカスタムクラス名 */
  textClassName?: string;
  /** アイコンとテキストの間隔（ml-X形式） */
  textMarginClassName?: string;
}

export function CollectionLikeButton({
  collectionId,
  currentUserId,
  likesCount = 0,
  size = 18,
  showCount = true,
  hideCountWhenZero = false,
  inactiveColor = colors.light["on-surface-variant"],
  isLiked = false,
  textClassName = 'text-on-surface-variant',
  textMarginClassName = 'ml-3',
}: CollectionLikeButtonProps) {
  const { mutate: toggleLike, isPending: isTogglingLike } = useToggleCollectionLike();

  const handleLikePress = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!currentUserId) {
        showLoginRequiredAlert('いいね');
        return;
      }
      if (isTogglingLike) return;
      toggleLike({ userId: currentUserId, collectionId, isLiked });
    },
    [currentUserId, isTogglingLike, toggleLike, collectionId, isLiked]
  );

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
        color={isLiked ? colors.action["action-like"] : inactiveColor}
      />
      {showCount && (!hideCountWhenZero || likesCount > 0) && (
        <Text className={`${textClassName} ${textMarginClassName}`}>
          {likesCount}
        </Text>
      )}
    </Pressable>
  );
}
