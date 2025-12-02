/**
 * ブックマークフォルダ一覧Widget
 *
 * フォルダ一覧を表示し、選択・編集・削除機能を提供
 */

import {
  useBookmarkFolders,
  useBookmarks,
  useDeleteBookmarkFolder,
  useUpdateBookmarkFolder,
} from '@/entities/bookmark';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';
import type { BookmarkFolder } from '@/shared/api/supabase/bookmarks';
import { colors } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

interface BookmarkFolderListProps {
  userId: string;
  activeTab: BookmarkTabMode;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
}

export function BookmarkFolderList({
  userId,
  activeTab,
  onFolderSelect,
  onCreateFolder,
}: BookmarkFolderListProps) {
  // activeTabに応じたフォルダのみ取得
  const { data: folders = [] } = useBookmarkFolders(userId, activeTab);
  const { data: allBookmarks = [] } = useBookmarks(userId, undefined);
  const { mutate: deleteFolder } = useDeleteBookmarkFolder();
  const { mutate: updateFolder } = useUpdateBookmarkFolder();

  // 編集モーダルの状態
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(
    null
  );
  const [editingName, setEditingName] = useState('');

  // フォルダごとのブックマーク数を計算
  const folderCounts = useMemo(() => {
    const counts: Record<string, { spots: number; maps: number }> = {
      uncategorized: { spots: 0, maps: 0 },
    };

    folders.forEach((folder) => {
      counts[folder.id] = { spots: 0, maps: 0 };
    });

    allBookmarks.forEach((bookmark) => {
      const folderId = bookmark.folder_id || 'uncategorized';
      if (!counts[folderId]) {
        counts[folderId] = { spots: 0, maps: 0 };
      }
      if (bookmark.spot_id) {
        counts[folderId].spots++;
      }
      if (bookmark.map_id) {
        counts[folderId].maps++;
      }
    });

    return counts;
  }, [allBookmarks, folders]);

  // フォルダ編集を開始
  const handleEditFolder = useCallback((folder: BookmarkFolder) => {
    setEditingFolder(folder);
    setEditingName(folder.name);
  }, []);

  // フォルダ編集を保存
  const handleSaveEdit = useCallback(() => {
    if (!editingFolder || !editingName.trim()) return;

    updateFolder({
      folderId: editingFolder.id,
      updates: { name: editingName.trim() },
      userId,
    });
    setEditingFolder(null);
    setEditingName('');
  }, [editingFolder, editingName, updateFolder, userId]);

  // フォルダ削除
  const handleDeleteFolder = useCallback(
    (folder: BookmarkFolder) => {
      Alert.alert(
        'フォルダを削除',
        `「${folder.name}」を削除しますか？\nフォルダ内のブックマークは「後で見る」に移動します。`,
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '削除',
            style: 'destructive',
            onPress: () => {
              deleteFolder({ folderId: folder.id, userId });
            },
          },
        ]
      );
    },
    [userId, deleteFolder]
  );

  const foldersWithDefault = useMemo(
    () => [
      {
        id: 'uncategorized',
        name: '後で見る',
        user_id: userId,
        order_index: -1,
        created_at: '',
      },
      ...folders,
    ],
    [folders, userId]
  );

  const renderFolderItem = useCallback(
    ({ item }: { item: (typeof foldersWithDefault)[0] }) => {
      const count = folderCounts[item.id]?.[activeTab] || 0;
      const isUncategorized = item.id === 'uncategorized';

      return (
        <Pressable
          onPress={() => onFolderSelect(item.id)}
          className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center"
        >
          <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="folder" size={24} color={colors.primary.DEFAULT} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500">{count}件</Text>
          </View>

          {/* 3点リーダーメニュー（後で見る以外） */}
          {!isUncategorized && (
            <Menu>
              <MenuTrigger>
                <View className="p-2">
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color={colors.text.secondary}
                  />
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    borderRadius: 8,
                    padding: 4,
                    width: 140,
                  },
                }}
              >
                <MenuOption
                  onSelect={() => handleEditFolder(item as BookmarkFolder)}
                >
                  <View className="flex-row items-center px-3 py-2">
                    <Ionicons
                      name="pencil"
                      size={18}
                      color={colors.text.primary}
                    />
                    <Text className="ml-2 text-gray-900">編集</Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() => handleDeleteFolder(item as BookmarkFolder)}
                >
                  <View className="flex-row items-center px-3 py-2">
                    <Ionicons name="trash" size={18} color="#EF4444" />
                    <Text className="ml-2 text-red-500">削除</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        </Pressable>
      );
    },
    [
      folderCounts,
      activeTab,
      onFolderSelect,
      handleEditFolder,
      handleDeleteFolder,
    ]
  );

  return (
    <>
      <FlatList
        data={foldersWithDefault}
        keyExtractor={(item) => item.id}
        renderItem={renderFolderItem}
        ListFooterComponent={
          <Pressable
            onPress={onCreateFolder}
            className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center"
          >
            <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center mr-3">
              <Ionicons name="add" size={24} color={colors.primary.DEFAULT} />
            </View>
            <Text className="text-base font-medium text-blue-500">
              新しいフォルダを作成
            </Text>
          </Pressable>
        }
      />

      {/* フォルダ名編集モーダル */}
      <Modal
        visible={!!editingFolder}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingFolder(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              フォルダ名を編集
            </Text>
            <TextInput
              value={editingName}
              onChangeText={setEditingName}
              placeholder="フォルダ名"
              className="bg-gray-100 rounded-lg px-4 py-3 text-base mb-4"
              autoFocus
            />
            <View className="flex-row justify-end">
              <Pressable
                onPress={() => setEditingFolder(null)}
                className="px-4 py-2 mr-2"
              >
                <Text className="text-gray-500 font-medium">キャンセル</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveEdit}
                disabled={!editingName.trim()}
                className="px-4 py-2 bg-blue-500 rounded-lg"
                style={{ opacity: editingName.trim() ? 1 : 0.5 }}
              >
                <Text className="text-white font-medium">保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
