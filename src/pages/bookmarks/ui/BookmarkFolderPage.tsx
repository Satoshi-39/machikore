/**
 * ブックマークフォルダ詳細ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';
import { BookmarkItemList } from '@/widgets/bookmark-folder-list';
import { useCurrentUserId } from '@/entities/user';
import { useBookmarkFolders } from '@/entities/bookmark';
import { useIsDarkMode } from '@/shared/lib/providers';

interface BookmarkFolderPageProps {
  folderId: string;
  tabMode?: BookmarkTabMode;
}

export function BookmarkFolderPage({ folderId, tabMode = 'spots' }: BookmarkFolderPageProps) {
  const router = useRouter();
  const userId = useCurrentUserId();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();

  // フォルダ名を取得
  const { data: folders = [] } = useBookmarkFolders(userId);
  const folderName = folderId === 'uncategorized'
    ? '後で見る'
    : folders.find((f) => f.id === folderId)?.name || 'フォルダ';

  if (!userId) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary">ログインしてください</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      {/* ヘッダー */}
      <View
        className="bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border px-4 py-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-center relative">
          <Pressable
            onPress={() => router.back()}
            className="absolute left-0"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#F9FAFB' : '#111827'} />
          </Pressable>
          <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
            {folderName}
          </Text>
        </View>
      </View>

      {/* コンテンツ */}
      <BookmarkItemList
        userId={userId}
        folderId={folderId}
        activeTab={tabMode}
      />
    </View>
  );
}
