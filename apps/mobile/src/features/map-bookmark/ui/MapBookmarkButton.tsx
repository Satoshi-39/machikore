/**
 * マップブックマークボタン
 *
 * ブックマーク状態の取得・フォルダ選択モーダル・表示を一元化した共通コンポーネント
 * N+1問題回避のため、isBookmarkedはJOINで取得して渡すことを推奨
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

interface MapBookmarkButtonProps {
  /** マップID */
  mapId: string;
  /** 現在のユーザーID（ログイン状態判定用） */
  currentUserId?: string | null;
  /** ブックマーク数（表示する場合） */
  bookmarksCount?: number;
  /** アイコンサイズ */
  size?: number;
  /** ブックマーク数を表示するか */
  showCount?: boolean;
  /** 非アクティブ時のアイコン色 */
  inactiveColor?: string;
  /** ブックマーク状態（JOINで取得済みの値を渡す） */
  isBookmarked?: boolean;
}

export function MapBookmarkButton({
  mapId,
  currentUserId,
  bookmarksCount = 0,
  size = 18,
  showCount = false,
  inactiveColor = colors.text.secondary,
  isBookmarked = false,
}: MapBookmarkButtonProps) {
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();

  const handleBookmarkPress = useCallback(
    (e: any) => {
      e.stopPropagation();
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
      addBookmark({ userId: currentUserId, mapId, folderId });
    },
    [currentUserId, mapId, addBookmark]
  );

  const handleRemoveFromFolder = useCallback(
    (folderId: string | null) => {
      if (!currentUserId) return;
      removeFromFolder({ userId: currentUserId, mapId, folderId });
    },
    [currentUserId, mapId, removeFromFolder]
  );

  return (
    <>
      <View className="flex-row items-center">
        <Pressable
          onPress={handleBookmarkPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: showCount ? 5 : 10 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={size}
            color={inactiveColor}
          />
        </Pressable>
        {showCount && (
          <Pressable
            onPress={handleBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
          >
            <Text
              className="text-foreground-secondary dark:text-dark-foreground-secondary ml-1"
              style={{ fontSize: size * 0.78 }}
            >
              {bookmarksCount}
            </Text>
          </Pressable>
        )}
      </View>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="maps"
          mapId={mapId}
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
        />
      )}
    </>
  );
}
