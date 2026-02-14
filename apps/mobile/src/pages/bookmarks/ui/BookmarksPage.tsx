/**
 * ブックマーク一覧ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * スポット/マップをタブで切り替え
 * 各タブ内でフォルダ一覧を表示
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookmarkTabFilter, type BookmarkTabMode } from '@/features/filter-bookmark-tab';
import { CreateFolderModal } from '@/features/create-bookmark-folder';
import { useBookmarkLimitGuard } from '@/features/check-usage-limit';
import { BookmarkFolderList } from '@/widgets/bookmark-folder-list';
import { useCurrentUserId } from '@/entities/user';
import { useBookmarkFolders, useFolderBookmarkCounts } from '@/entities/bookmark';
import { useFolderCountLimit } from '@/entities/subscription';
import { PageHeader, RepeatSkeleton, BookmarkFolderSkeleton } from '@/shared/ui';
import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';

export function BookmarksPage() {
  const { t } = useI18n();
  const isDarkMode = useIsDarkMode();
  const userId = useCurrentUserId();
  const [activeTab, setActiveTab] = useState<BookmarkTabMode>('maps');
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
  const { checkFolderLimit } = useBookmarkLimitGuard();
  const folderLimit = useFolderCountLimit();

  // データ取得（ローディング状態用）- 軽量クエリのみ使用
  const { data: folders = [], isLoading: foldersLoading } = useBookmarkFolders(userId, activeTab);
  const { isLoading: countsLoading } = useFolderBookmarkCounts(userId);
  const isLoading = foldersLoading || countsLoading;

  // フォルダ数が上限に達しているか
  const isAtFolderLimit = folders.length >= folderLimit;

  // フォルダ追加ボタンのハンドラ
  const handleAddFolderPress = useCallback(async () => {
    if (isAtFolderLimit) {
      // 上限に達している場合はアップグレードアラートを表示
      // is_premiumはDBから取得する必要があるのでcheckFolderLimitを使用
      const canCreate = await checkFolderLimit(activeTab);
      if (!canCreate) return; // アラートが表示される
    }
    // フォルダ作成モーダルを開く
    setIsCreateFolderModalVisible(true);
  }, [isAtFolderLimit, checkFolderLimit, activeTab]);

  if (!userId) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('bookmark.bookmarks')} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-on-surface-variant">{t('bookmark.loginRequired')}</Text>
        </View>
      </View>
    );
  }

  // ヘッダー右側のフォルダ追加ボタン
  const headerRightComponent = (
    <Pressable onPress={handleAddFolderPress} className="p-1">
      <Ionicons
        name="add"
        size={iconSizeNum.xl}
        color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
      />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('bookmark.bookmarks')} rightComponent={headerRightComponent} />
      {/* スポット/マップ タブ */}
      <BookmarkTabFilter tabMode={activeTab} onTabModeChange={setActiveTab} />

      {/* コンテンツ */}
      {isLoading ? (
        <RepeatSkeleton component={BookmarkFolderSkeleton} count={5} />
      ) : (
        <BookmarkFolderList
          userId={userId}
          activeTab={activeTab}
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
