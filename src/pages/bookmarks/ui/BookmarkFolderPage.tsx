/**
 * ブックマークフォルダ詳細ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';
import { BookmarkItemList } from '@/widgets/bookmark-folder-list';
import { useCurrentUserId } from '@/entities/user';
import { useBookmarkFolders } from '@/entities/bookmark';
import { PageHeader } from '@/shared/ui';

interface BookmarkFolderPageProps {
  folderId: string;
  tabMode?: BookmarkTabMode;
}

export function BookmarkFolderPage({ folderId, tabMode = 'spots' }: BookmarkFolderPageProps) {
  const userId = useCurrentUserId();

  // フォルダ名を取得
  const { data: folders = [] } = useBookmarkFolders(userId);
  const folderName = folderId === 'uncategorized'
    ? '後で見る'
    : folders.find((f) => f.id === folderId)?.name || 'フォルダ';

  if (!userId) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={folderName} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary">ログインしてください</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={folderName} />
      <BookmarkItemList
        userId={userId}
        folderId={folderId}
        activeTab={tabMode}
      />
    </View>
  );
}
