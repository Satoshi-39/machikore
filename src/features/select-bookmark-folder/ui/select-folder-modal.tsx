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
import { colors } from '@/shared/config';
import { useBookmarkFolders, useCreateBookmarkFolder } from '@/entities/bookmark';
import type { BookmarkFolderType } from '@/shared/api/supabase/bookmarks';

interface SelectFolderModalProps {
  visible: boolean;
  userId: string;
  folderType: BookmarkFolderType;
  onClose: () => void;
  /** フォルダに追加する時に呼ばれる */
  onAddToFolder: (folderId: string | null) => void;
  /** フォルダから削除する時に呼ばれる */
  onRemoveFromFolder: (folderId: string | null) => void;
  /** 現在ブックマークされているフォルダIDのセット */
  bookmarkedFolderIds: Set<string | null>;
}

export function SelectFolderModal({
  visible,
  userId,
  folderType,
  onClose,
  onAddToFolder,
  onRemoveFromFolder,
  bookmarkedFolderIds,
}: SelectFolderModalProps) {
  const { data: folders = [] } = useBookmarkFolders(userId, folderType);
  const { mutate: createFolder, isPending: isCreating } = useCreateBookmarkFolder();

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
    { id: null as string | null, name: '後で見る', isDefault: true },
    ...folders.map((f) => ({ ...f, isDefault: false })),
  ], [folders]);

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
          className="bg-surface dark:bg-dark-surface rounded-2xl mx-6 w-full max-w-sm overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <View className="px-6 py-4 border-b border-border-light dark:border-dark-border-light">
            <Text className="text-center text-lg font-bold text-foreground dark:text-dark-foreground">
              {folderType === 'spots' ? 'スポット' : 'マップ'}の保存先を選択
            </Text>
          </View>

          {/* フォルダリスト */}
          <ScrollView className="max-h-64">
            {foldersWithDefault.map((item) => {
              const isInFolder = localBookmarkedFolderIds.has(item.id);
              return (
                <View
                  key={item.id ?? 'default'}
                  className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-border-light"
                >
                  <View className="w-9 h-9 rounded-lg bg-muted dark:bg-dark-muted items-center justify-center mr-3">
                    <Ionicons
                      name="folder"
                      size={20}
                      color={colors.primary.DEFAULT}
                    />
                  </View>
                  <Text className="flex-1 text-base text-foreground dark:text-dark-foreground">
                    {item.name}
                  </Text>
                  {isInFolder ? (
                    <Pressable
                      onPress={() => handleRemoveFromFolder(item.id)}
                      className="bg-blue-500 px-4 py-1.5 rounded-full active:bg-blue-600"
                    >
                      <Text className="text-sm text-white font-medium">追加済</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => handleAddToFolder(item.id)}
                      className="bg-surface dark:bg-dark-surface border border-blue-500 px-4 py-1.5 rounded-full active:bg-blue-50"
                    >
                      <Text className="text-sm text-blue-500 font-medium">追加</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* 新規フォルダ作成 */}
          {showCreateInput ? (
            <View className="px-4 py-3 border-t border-border-light dark:border-dark-border-light">
              <View className="flex-row items-center">
                <TextInput
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="フォルダ名"
                  className="flex-1 border border-border dark:border-dark-border rounded-lg px-3 py-2 text-base mr-2"
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
                  <Text className="text-white font-medium">作成</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setShowCreateInput(false)}
                className="mt-2"
              >
                <Text className="text-center text-foreground-secondary dark:text-dark-foreground-secondary text-sm">キャンセル</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowCreateInput(true)}
              className="flex-row items-center px-4 py-3 border-t border-border-light dark:border-dark-border-light active:bg-background-secondary dark:bg-dark-background-secondary"
            >
              <View className="w-9 h-9 rounded-lg bg-blue-100 items-center justify-center mr-3">
                <Ionicons name="add" size={20} color={colors.primary.DEFAULT} />
              </View>
              <Text className="text-base font-medium text-blue-500">
                新しいフォルダを作成
              </Text>
            </Pressable>
          )}

          {/* アクションボタン */}
          <View className="px-4 py-3 border-t border-border dark:border-dark-border">
            <Pressable
              onPress={onClose}
              className="py-3 bg-muted dark:bg-dark-muted rounded-lg active:bg-gray-200"
            >
              <Text className="text-center text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary">
                閉じる
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
