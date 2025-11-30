/**
 * ブックマーク一覧ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * スポット/マップをタブで切り替え
 * 各タブ内でフォルダ一覧を表示
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BookmarkTabFilter, type BookmarkTabMode } from '@/features/filter-bookmark-tab';
import { CreateFolderModal } from '@/features/create-bookmark-folder';
import { BookmarkFolderList, BookmarkItemList } from '@/widgets/bookmark-folder-list';
import { useCurrentUserId } from '@/entities/user';
import { useBookmarkFolders, useBookmarks } from '@/entities/bookmark';
import { PageHeader } from '@/shared/ui';

export function BookmarksPage() {
  const userId = useCurrentUserId();
  const [activeTab, setActiveTab] = useState<BookmarkTabMode>('spots');
  // スポット用とマップ用で別々のselectedFolderIdを保持
  const [spotsFolderId, setSpotsFolderId] = useState<string | null>(null);
  const [mapsFolderId, setMapsFolderId] = useState<string | null>(null);
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);

  // 現在のタブのselectedFolderId
  const selectedFolderId = activeTab === 'spots' ? spotsFolderId : mapsFolderId;
  const setSelectedFolderId = activeTab === 'spots' ? setSpotsFolderId : setMapsFolderId;

  // データ取得（ローディング状態用）
  const { isLoading: foldersLoading } = useBookmarkFolders(userId);
  const { isLoading: bookmarksLoading } = useBookmarks(userId, undefined);
  const isLoading = foldersLoading || bookmarksLoading;

  if (!userId) {
    return (
      <View className="flex-1 bg-gray-50">
        <PageHeader title="ブックマーク" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">ログインしてください</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="ブックマーク" />
      {/* スポット/マップ タブ */}
      <BookmarkTabFilter tabMode={activeTab} onTabModeChange={setActiveTab} />

      {/* コンテンツ */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">読み込み中...</Text>
        </View>
      ) : selectedFolderId !== null ? (
        <BookmarkItemList
          userId={userId}
          folderId={selectedFolderId}
          activeTab={activeTab}
          onBack={() => setSelectedFolderId(null)}
        />
      ) : (
        <BookmarkFolderList
          userId={userId}
          activeTab={activeTab}
          onFolderSelect={setSelectedFolderId}
          onCreateFolder={() => setIsCreateFolderModalVisible(true)}
        />
      )}

      {/* フォルダ作成モーダル */}
      <CreateFolderModal
        visible={isCreateFolderModalVisible}
        userId={userId}
        folderType={activeTab}
        onClose={() => setIsCreateFolderModalVisible(false)}
      />
    </View>
  );
}
