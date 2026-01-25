/**
 * スポットブックマークボタン
 *
 * ブックマーク状態の取得・フォルダ選択モーダル・表示を一元化した共通コンポーネント
 * N+1問題回避のため、isBookmarkedはJOINで取得して渡すことを推奨
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useBookmarkSpot, useUnbookmarkSpotFromFolder, useSpotBookmarkInfo } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

interface SpotBookmarkButtonProps {
  /** スポットID */
  spotId: string;
  /** 現在のユーザーID（ログイン状態判定用） */
  currentUserId?: string | null;
  /** アイコンサイズ */
  size?: number;
  /** 非アクティブ時のアイコン色 */
  inactiveColor?: string;
  /** アクティブ時のアイコン色 */
  activeColor?: string;
  /** ブックマーク状態（JOINで取得済みの値を渡す） */
  isBookmarked?: boolean;
  /** ボタンのバリアント */
  variant?: 'icon-only' | 'with-label' | 'inline';
  /** ラベルのクラス名（inline用） */
  labelClassName?: string;
}

export function SpotBookmarkButton({
  spotId,
  currentUserId,
  size = 18,
  inactiveColor = colors.text.secondary,
  activeColor,
  isBookmarked: isBookmarkedProp = false,
  variant = 'with-label',
  labelClassName,
}: SpotBookmarkButtonProps) {
  const { t } = useI18n();
  // activeColorが指定されていない場合はinactiveColorと同じ色を使う（元の動作を維持）
  const finalActiveColor = activeColor ?? inactiveColor;
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  const { mutate: addBookmark, isPending: isAdding } = useBookmarkSpot();
  const { mutate: removeFromFolder, isPending: isRemoving } = useUnbookmarkSpotFromFolder();
  const isPending = isAdding || isRemoving;

  // ブックマーク状態を取得（楽観的更新で即座に反映される）
  const { data: bookmarkInfo } = useSpotBookmarkInfo(currentUserId, spotId);
  // bookmarkInfoがあればそれを使用、なければpropsの値を使用
  const isBookmarked = bookmarkInfo !== undefined ? bookmarkInfo.length > 0 : isBookmarkedProp;

  const handleBookmarkPress = useCallback(
    (e?: any) => {
      e?.stopPropagation?.();
      if (!currentUserId) {
        showLoginRequiredAlert('保存');
        return;
      }
      setIsFolderModalVisible(true);
    },
    [currentUserId]
  );

  const handleAddToFolder = useCallback(
    (folderId: string | null) => {
      if (!currentUserId) return;
      addBookmark({ userId: currentUserId, spotId, folderId });
    },
    [currentUserId, spotId, addBookmark]
  );

  const handleRemoveFromFolder = useCallback(
    (folderId: string | null) => {
      if (!currentUserId) return;
      removeFromFolder({ userId: currentUserId, spotId, folderId });
    },
    [currentUserId, spotId, removeFromFolder]
  );

  const iconColor = isBookmarked ? finalActiveColor : inactiveColor;

  const renderButton = () => {
    if (variant === 'icon-only') {
      return (
        <Pressable
          onPress={handleBookmarkPress}
          disabled={isPending}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={size}
            color={iconColor}
          />
        </Pressable>
      );
    }

    if (variant === 'inline') {
      return (
        <Pressable
          onPress={handleBookmarkPress}
          disabled={isPending}
          className="flex-row items-center active:opacity-70"
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={size}
            color={iconColor}
          />
          <Text className={labelClassName ?? "text-xs text-on-surface-variant ml-1"}>
            {t('common.save')}
          </Text>
        </Pressable>
      );
    }

    // with-label (default)
    return (
      <Pressable
        onPress={handleBookmarkPress}
        disabled={isPending}
        className="items-center"
      >
        <View className="flex-row items-center justify-center h-6">
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={size}
            color={iconColor}
          />
        </View>
        <Text className="text-xs text-on-surface-variant">
          {t('common.save')}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      {renderButton()}

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="spots"
          spotId={spotId}
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
        />
      )}
    </>
  );
}
