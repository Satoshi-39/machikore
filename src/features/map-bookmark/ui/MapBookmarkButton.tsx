/**
 * マップブックマークボタン
 *
 * ブックマーク状態の取得・フォルダ選択モーダル・表示を一元化した共通コンポーネント
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useMapBookmarkInfo, useBookmarkMap, useUnbookmarkMapFromFolder } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

interface MapBookmarkButtonProps {
  /** マップID */
  mapId: string;
  /** 現在のユーザーID（ログイン状態判定用） */
  currentUserId?: string | null;
  /** アイコンサイズ */
  size?: number;
  /** 非アクティブ時のアイコン色 */
  inactiveColor?: string;
}

export function MapBookmarkButton({
  mapId,
  currentUserId,
  size = 18,
  inactiveColor = colors.text.secondary,
}: MapBookmarkButtonProps) {
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  // ブックマーク状態
  const { data: bookmarkInfo = [] } = useMapBookmarkInfo(currentUserId, mapId);
  const isBookmarked = bookmarkInfo.length > 0;
  const bookmarkedFolderIds = useMemo(
    () => new Set(bookmarkInfo.map((b) => b.folder_id)),
    [bookmarkInfo]
  );

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
      <Pressable
        onPress={handleBookmarkPress}
        className="flex-row items-center"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={size}
          color={isBookmarked ? colors.primary.DEFAULT : inactiveColor}
        />
      </Pressable>

      {/* フォルダ選択モーダル */}
      {currentUserId && (
        <SelectFolderModal
          visible={isFolderModalVisible}
          userId={currentUserId}
          folderType="maps"
          onClose={() => setIsFolderModalVisible(false)}
          onAddToFolder={handleAddToFolder}
          onRemoveFromFolder={handleRemoveFromFolder}
          bookmarkedFolderIds={bookmarkedFolderIds}
        />
      )}
    </>
  );
}
