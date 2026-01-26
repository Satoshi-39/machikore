/**
 * ブックマークフォルダ選択モーダル
 *
 * スポット/マップを保存する際にフォルダを選択するためのモーダル
 * 画面中央にダイアログとして表示
 * 複数フォルダへの追加に対応
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookmarkFolders, useCreateBookmarkFolder, useSpotBookmarkInfo, useMapBookmarkInfo } from '@/entities/bookmark';
import type { BookmarkFolderType } from '@/shared/api/supabase/bookmarks';
import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface SelectFolderModalProps {
  visible: boolean;
  userId: string;
  folderType: BookmarkFolderType;
  onClose: () => void;
  /** フォルダに追加する時に呼ばれる */
  onAddToFolder: (folderId: string | null) => void;
  /** フォルダから削除する時に呼ばれる */
  onRemoveFromFolder: (folderId: string | null) => void;
  /** 対象のスポットID（folderType='spots'の場合に必須） */
  spotId?: string;
  /** 対象のマップID（folderType='maps'の場合に必須） */
  mapId?: string;
}

export function SelectFolderModal({
  visible,
  userId,
  folderType,
  onClose,
  onAddToFolder,
  onRemoveFromFolder,
  spotId,
  mapId,
}: SelectFolderModalProps) {
  const { t } = useI18n();
  const { data: folders = [] } = useBookmarkFolders(userId, folderType);
  const { mutate: createFolder, isPending: isCreating } = useCreateBookmarkFolder();

  // モーダル内でブックマーク情報を取得（どのフォルダに入っているか）
  const { data: spotBookmarkInfo = [] } = useSpotBookmarkInfo(
    folderType === 'spots' ? userId : undefined,
    folderType === 'spots' ? spotId : undefined
  );
  const { data: mapBookmarkInfo = [] } = useMapBookmarkInfo(
    folderType === 'maps' ? userId : undefined,
    folderType === 'maps' ? mapId : undefined
  );

  // ブックマーク済みフォルダIDのセット
  const bookmarkedFolderIds = useMemo(() => {
    if (folderType === 'spots' && spotId) {
      return new Set(spotBookmarkInfo.map((b) => b.folder_id));
    }
    if (folderType === 'maps' && mapId) {
      return new Set(mapBookmarkInfo.map((b) => b.folder_id));
    }
    return new Set<string | null>();
  }, [folderType, spotId, mapId, spotBookmarkInfo, mapBookmarkInfo]);

  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // ローカルで選択状態を管理（モーダル内での即時反映用）
  const [localBookmarkedFolderIds, setLocalBookmarkedFolderIds] = useState<Set<string | null>>(
    new Set(bookmarkedFolderIds)
  );

  // モーダルが開いた時に親の状態で初期化
  useEffect(() => {
    if (visible) {
      setLocalBookmarkedFolderIds(new Set(bookmarkedFolderIds));
    }
  }, [visible, bookmarkedFolderIds]);

  // モーダルを閉じた時にリセット
  useEffect(() => {
    if (!visible) {
      setShowCreateInput(false);
      setNewFolderName('');
    }
  }, [visible]);

  // フォルダに追加
  const handleAddToFolder = useCallback(
    (folderId: string | null) => {
      onAddToFolder(folderId);
      // ローカル状態を更新（モーダルは閉じない）
      setLocalBookmarkedFolderIds((prev) => {
        const next = new Set(prev);
        next.add(folderId);
        return next;
      });
    },
    [onAddToFolder]
  );

  // フォルダから削除
  const handleRemoveFromFolder = useCallback(
    (folderId: string | null) => {
      onRemoveFromFolder(folderId);
      // ローカル状態を更新（モーダルは閉じない）
      setLocalBookmarkedFolderIds((prev) => {
        const next = new Set(prev);
        next.delete(folderId);
        return next;
      });
    },
    [onRemoveFromFolder]
  );

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim() || isCreating) return;
    createFolder(
      { userId, name: newFolderName.trim(), folderType },
      {
        onSuccess: (newFolder) => {
          setNewFolderName('');
          setShowCreateInput(false);
          // 作成したフォルダに追加
          handleAddToFolder(newFolder.id);
        },
      }
    );
  }, [userId, newFolderName, folderType, createFolder, handleAddToFolder, isCreating]);

  // デフォルト + ユーザー作成フォルダのリスト
  const foldersWithDefault = useMemo(() => [
    { id: null as string | null, name: t('bookmark.watchLater'), isDefault: true },
    ...folders.map((f) => ({ ...f, isDefault: false })),
  ], [folders, t]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-surface-variant rounded-2xl mx-6 w-full max-w-sm overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <View className="px-6 py-4 border-b border-outline-variant">
            <Text className="text-center text-lg font-bold text-on-surface">
              {folderType === 'spots' ? t('bookmark.selectSpotFolder') : t('bookmark.selectMapFolder')}
            </Text>
          </View>

          {/* フォルダリスト */}
          <ScrollView className="max-h-64">
            {foldersWithDefault.map((item) => {
              const isInFolder = localBookmarkedFolderIds.has(item.id);
              return (
                <View
                  key={item.id ?? 'default'}
                  className="flex-row items-center px-4 py-3 border-b border-outline-variant"
                >
                  <View className="w-9 h-9 rounded-lg bg-secondary items-center justify-center mr-3">
                    <Ionicons
                      name="folder"
                      size={iconSizeNum.md}
                      className="text-primary"
                    />
                  </View>
                  <Text className="flex-1 text-base text-on-surface">
                    {item.name}
                  </Text>
                  {isInFolder ? (
                    <Pressable
                      onPress={() => handleRemoveFromFolder(item.id)}
                      className="bg-foreground-secondary px-4 py-1.5 rounded-full active:opacity-80"
                    >
                      <Text className="text-sm text-white font-medium">{t('bookmark.added')}</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => handleAddToFolder(item.id)}
                      className="bg-surface-variant border border-foreground-secondary-secondary px-4 py-1.5 rounded-full active:opacity-80"
                    >
                      <Text className="text-sm text-on-surface-variant font-medium">{t('bookmark.add')}</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* 新規フォルダ作成 */}
          {showCreateInput ? (
            <View className="px-4 py-3 border-t border-outline-variant">
              <View className="flex-row items-center">
                <TextInput
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder={t('bookmark.folderNamePlaceholder')}
                  placeholderTextColor={colors.light['on-surface-variant']}
                  className="flex-1 border border-outline rounded-lg px-3 py-2 text-base text-on-surface mr-2"
                  autoFocus
                  onSubmitEditing={handleCreateFolder}
                />
                <Pressable
                  onPress={handleCreateFolder}
                  disabled={!newFolderName.trim() || isCreating}
                  className={`px-3 py-2 rounded-lg ${
                    newFolderName.trim() && !isCreating ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <Text className="text-white font-medium">{t('bookmark.create')}</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setShowCreateInput(false)}
                className="mt-2"
              >
                <Text className="text-center text-on-surface-variant text-sm">{t('common.cancel')}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowCreateInput(true)}
              className="flex-row items-center px-4 py-3 border-t border-outline-variant active:bg-surface-variant"
            >
              <View className="w-9 h-9 rounded-lg bg-blue-100 items-center justify-center mr-3">
                <Ionicons name="add" size={iconSizeNum.md} className="text-primary" />
              </View>
              <Text className="text-base font-medium text-on-surface">
                {t('bookmark.createNewFolder')}
              </Text>
            </Pressable>
          )}

          {/* アクションボタン */}
          <View className="px-4 py-3 border-t border-outline">
            <Pressable
              onPress={onClose}
              className="py-3 bg-secondary rounded-lg active:bg-secondary-hover"
            >
              <Text className="text-center text-sm font-medium text-on-surface">
                {t('common.close')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
