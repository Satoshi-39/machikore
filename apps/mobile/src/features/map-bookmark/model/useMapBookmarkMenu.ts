/**
 * マップブックマークメニュー用hook
 *
 * ポップアップメニューからブックマークフォルダ選択モーダルを開くためのhook
 * menuItemをPopupMenuに追加し、modalPropsをSelectFolderModalに渡すことで使用
 */

import { useState, useCallback, useMemo } from 'react';
import { showLoginRequiredAlert } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { useBookmarkMap, useUnbookmarkMapFromFolder, useMapBookmarkInfo } from '@/entities/bookmark';
import type { PopupMenuItem } from '@/shared/ui';

interface UseMapBookmarkMenuProps {
  mapId: string;
  currentUserId?: string | null;
}

interface UseMapBookmarkMenuResult {
  /** ブックマーク状態 */
  isBookmarked: boolean;
  /** PopupMenu用のメニューアイテム */
  menuItem: PopupMenuItem;
  /** SelectFolderModalに渡すprops */
  modalProps: {
    visible: boolean;
    userId: string;
    folderType: 'maps';
    mapId: string;
    onClose: () => void;
    onAddToFolder: (folderId: string | null) => void;
    onRemoveFromFolder: (folderId: string | null) => void;
  } | null;
}

export function useMapBookmarkMenu({
  mapId,
  currentUserId,
}: UseMapBookmarkMenuProps): UseMapBookmarkMenuResult {
  const { t } = useI18n();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ブックマーク状態を取得
  const { data: bookmarkInfo } = useMapBookmarkInfo(currentUserId, mapId);
  const isBookmarked = bookmarkInfo !== undefined ? bookmarkInfo.length > 0 : false;

  // ブックマーク操作
  const { mutate: addBookmark } = useBookmarkMap();
  const { mutate: removeFromFolder } = useUnbookmarkMapFromFolder();

  const handleOpenModal = useCallback(() => {
    if (!currentUserId) {
      showLoginRequiredAlert(t('common.save'));
      return;
    }
    setIsModalVisible(true);
  }, [currentUserId, t]);

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

  // PopupMenu用のメニューアイテム
  const menuItem: PopupMenuItem = useMemo(
    () => ({
      id: 'bookmark',
      label: isBookmarked ? t('bookmark.saved') : t('bookmark.save'),
      icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
      iconColor: undefined, // デフォルト色を使用
      closeOnSelect: false,
      onPress: handleOpenModal,
    }),
    [isBookmarked, handleOpenModal, t]
  );

  // SelectFolderModal用のprops
  const modalProps = currentUserId
    ? {
        visible: isModalVisible,
        userId: currentUserId,
        folderType: 'maps' as const,
        mapId,
        onClose: () => setIsModalVisible(false),
        onAddToFolder: handleAddToFolder,
        onRemoveFromFolder: handleRemoveFromFolder,
      }
    : null;

  return {
    isBookmarked,
    menuItem,
    modalProps,
  };
}
