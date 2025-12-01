/**
 * ブックマークフォルダ選択モーダル
 *
 * スポット/マップを保存する際にフォルダを選択するためのモーダル
 * 画面中央にダイアログとして表示
 */

import React, { useState, useCallback, useEffect } from 'react';
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
  onSelect: (folderId: string | null) => void;
  /** 既にブックマーク済みの場合true（解除モード） */
  isBookmarked?: boolean;
}

export function SelectFolderModal({
  visible,
  userId,
  folderType,
  onClose,
  onSelect,
  isBookmarked = false,
}: SelectFolderModalProps) {
  const { data: folders = [] } = useBookmarkFolders(userId, folderType);
  const { mutate: createFolder, isPending: isCreating } = useCreateBookmarkFolder();

  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // モーダルを閉じた時にリセット
  useEffect(() => {
    if (!visible) {
      setShowCreateInput(false);
      setNewFolderName('');
    }
  }, [visible]);

  const handleFolderSelect = useCallback(
    (folderId: string | null) => {
      onSelect(folderId);
      onClose();
    },
    [onSelect, onClose]
  );

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim() || isCreating) return;
    createFolder(
      { userId, name: newFolderName.trim(), folderType },
      {
        onSuccess: (newFolder) => {
          setNewFolderName('');
          setShowCreateInput(false);
          // 作成したフォルダを選択
          onSelect(newFolder.id);
          onClose();
        },
      }
    );
  }, [userId, newFolderName, folderType, createFolder, onSelect, onClose, isCreating]);

  const handleRemoveBookmark = useCallback(() => {
    // nullを渡してブックマーク解除を示す
    onSelect(null);
    onClose();
  }, [onSelect, onClose]);

  // デフォルト + ユーザー作成フォルダのリスト
  const foldersWithDefault = [
    { id: null, name: '後で見る', isDefault: true },
    ...folders.map((f) => ({ ...f, isDefault: false })),
  ];

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
          className="bg-white rounded-2xl mx-6 w-full max-w-sm overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-center text-lg font-bold text-gray-900">
              保存先を選択
            </Text>
          </View>

          {/* フォルダリスト */}
          <ScrollView className="max-h-64">
            {foldersWithDefault.map((item) => (
              <Pressable
                key={item.id ?? 'default'}
                onPress={() => handleFolderSelect(item.id)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50 border-b border-gray-100"
              >
                <View className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center mr-3">
                  <Ionicons
                    name="folder"
                    size={20}
                    color={colors.primary.DEFAULT}
                  />
                </View>
                <Text className="flex-1 text-base text-gray-900">{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* 新規フォルダ作成 */}
          {showCreateInput ? (
            <View className="px-4 py-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <TextInput
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="フォルダ名"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base mr-2"
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
                <Text className="text-center text-gray-500 text-sm">キャンセル</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowCreateInput(true)}
              className="flex-row items-center px-4 py-3 border-t border-gray-100 active:bg-gray-50"
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
          <View className="px-4 py-3 border-t border-gray-200 flex-row gap-2">
            {/* ブックマーク解除ボタン（既にブックマーク済みの場合） */}
            {isBookmarked && (
              <Pressable
                onPress={handleRemoveBookmark}
                className="flex-1 py-3 bg-red-50 rounded-lg active:bg-red-100"
              >
                <Text className="text-center text-sm font-medium text-red-500">
                  保存を解除
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={onClose}
              className="flex-1 py-3 bg-gray-100 rounded-lg active:bg-gray-200"
            >
              <Text className="text-center text-sm font-medium text-gray-600">
                キャンセル
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
