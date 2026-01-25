/**
 * ブックマークフォルダ詳細ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';
import { BookmarkedSpotList, BookmarkedMapList } from '@/widgets/bookmark-folder-list';
import { useCurrentUserId } from '@/entities/user';
import { useBookmarkFolders } from '@/entities/bookmark';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface BookmarkFolderPageProps {
  folderId: string;
  tabMode?: BookmarkTabMode;
}

export function BookmarkFolderPage({ folderId, tabMode = 'spots' }: BookmarkFolderPageProps) {
  const { t } = useI18n();
  const userId = useCurrentUserId();

  // フォルダ名を取得
  const { data: folders = [] } = useBookmarkFolders(userId);
  const folderName = folderId === 'uncategorized'
    ? t('bookmark.watchLater')
    : folders.find((f) => f.id === folderId)?.name || t('bookmark.folder');

  if (!userId) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={folderName} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-on-surface-variant">{t('bookmark.loginRequired')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={folderName} />
      {tabMode === 'spots' && <BookmarkedSpotList userId={userId} folderId={folderId} />}
      {tabMode === 'maps' && <BookmarkedMapList userId={userId} folderId={folderId} />}
    </View>
  );
}
