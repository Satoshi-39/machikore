/**
 * ブックマークフォルダ一覧Widget
 *
 * フォルダ一覧を表示し、選択・削除機能を提供
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import {
  useBookmarkFolders,
  useBookmarks,
  useDeleteBookmarkFolder,
} from '@/entities/bookmark';
import type { BookmarkFolder } from '@/shared/api/supabase/bookmarks';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';

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
  const { data: folders = [] } = useBookmarkFolders(userId);
  const { data: allBookmarks = [] } = useBookmarks(userId, undefined);
  const { mutate: deleteFolder } = useDeleteBookmarkFolder();

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

  // フォルダ削除
  const handleDeleteFolder = useCallback(
    (folder: BookmarkFolder) => {
      Alert.alert(
        'フォルダを削除',
        `「${folder.name}」を削除しますか？\nフォルダ内のブックマークは未分類に移動します。`,
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

  const foldersWithDefault = useMemo(() => [
    { id: 'uncategorized', name: '後で見る', user_id: userId, order_index: -1, created_at: '' },
    ...folders,
  ], [folders, userId]);

  const renderFolderItem = useCallback(
    ({ item }: { item: typeof foldersWithDefault[0] }) => {
      const count = folderCounts[item.id]?.[activeTab] || 0;
      const isUncategorized = item.id === 'uncategorized';

      return (
        <Pressable
          onPress={() => onFolderSelect(item.id)}
          onLongPress={() => {
            if (!isUncategorized) {
              handleDeleteFolder(item as BookmarkFolder);
            }
          }}
          className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center"
        >
          <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons
              name={isUncategorized ? 'folder-outline' : 'folder'}
              size={24}
              color={isUncategorized ? colors.text.secondary : colors.primary.DEFAULT}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500">{count}件</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </Pressable>
      );
    },
    [folderCounts, activeTab, onFolderSelect, handleDeleteFolder]
  );

  return (
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
  );
}
