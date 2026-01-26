/**
 * マップブックマークボタン
 *
 * ブックマーク状態の取得・フォルダ選択モーダル・表示を一元化した共通コンポーネント
 * N+1問題回避のため、isBookmarkedはJOINで取得して渡すことを推奨
 */

import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useBookmarkMap, useUnbookmarkMapFromFolder, useMapBookmarkInfo } from '@/entities/bookmark';
import { SelectFolderModal } from '@/features/select-bookmark-folder';

interface MapBookmarkButtonProps {
  /** マップID */
  mapId: string;
  /** 現在のユーザーID（ログイン状態判定用） */
  currentUserId?: string | null;
  /** アイコンサイズ */
  size?: number;
  /** ブックマーク状態（JOINで取得済みの値を渡す） */
  isBookmarked?: boolean;
}

export function MapBookmarkButton({
  mapId,
  currentUserId,
  size = 18,
  isBookmarked: isBookmarkedProp = false,
}: MapBookmarkButtonProps) {
  // アクション用の色（on-surface-variantと同じ）
  const bookmarkColor = colors.action["action-bookmark"];
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();

  // ブックマーク状態を取得（楽観的更新で即座に反映される）
  const { data: bookmarkInfo } = useMapBookmarkInfo(currentUserId, mapId);
  // bookmarkInfoがあればそれを使用、なければpropsの値を使用
  const isBookmarked = bookmarkInfo !== undefined ? bookmarkInfo.length > 0 : isBookmarkedProp;

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
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          size={size}
          color={bookmarkColor}
        />
      </Pressable>

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
