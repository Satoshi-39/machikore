/**
 * ブックマークしたマップ一覧Widget（無限スクロール対応）
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { useBookmarkedMaps } from '@/entities/bookmark';
import { removeBookmark, type BookmarkedMapItem } from '@/shared/api/supabase/bookmarks';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import type { MapWithUser } from '@/shared/types';
import { SwipeableRow } from '@/shared/ui';
import { MapListCard } from '@/widgets/map-cards';
import { useI18n } from '@/shared/lib/i18n';

interface BookmarkedMapListProps {
  userId: string;
  folderId: string;
}

export function BookmarkedMapList({ userId, folderId }: BookmarkedMapListProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  // folderIdの解釈：'uncategorized' → null（未分類）、それ以外 → そのフォルダID
  const actualFolderId = folderId === 'uncategorized' ? null : folderId;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useBookmarkedMaps(userId, actualFolderId);

  // ページデータをフラット化
  const bookmarks = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  // 無限スクロール用ハンドラ
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // フッターコンポーネント（ローディング表示）
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  // 記事への遷移（カードタップ）
  const navigateToArticle = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  // マップへの遷移（マップアイコンタップ）
  const navigateToMap = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  // ユーザープロフィールへの遷移
  const navigateToUser = useCallback(
    (navUserId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${navUserId}` as Href);
    },
    [router, currentTab]
  );

  // ブックマーク削除
  const handleDeleteBookmark = useCallback(
    async (bookmarkId: string) => {
      try {
        await removeBookmark(bookmarkId);
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarkedMaps(userId),
        });
      } catch (error) {
        log.error('[BookmarkedMapList] Failed to delete bookmark:', error);
      }
    },
    [userId, queryClient]
  );

  const renderItem = useCallback(
    ({ item }: { item: BookmarkedMapItem }) => {
      return (
        <SwipeableRow onDelete={() => handleDeleteBookmark(item.bookmarkId)}>
          <MapListCard
            map={item.map as MapWithUser}
            currentUserId={userId}
            isOwner={item.map.user?.id === userId}
            onPress={() => navigateToArticle(item.map.id)}
            onUserPress={navigateToUser}
            onMapPress={navigateToMap}
          />
        </SwipeableRow>
      );
    },
    [navigateToArticle, navigateToUser, navigateToMap, handleDeleteBookmark, userId]
  );

  // ローディング中
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  // ブックマークが空
  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="bookmark-outline" size={iconSizeNum['3xl']} className="text-on-surface-variant" />
        <Text className="text-on-surface-variant mt-4">
          {t('bookmark.noMapBookmarks')}
        </Text>
      </View>
    );
  }

  return (
    <FlashList
      data={bookmarks}
      keyExtractor={(item) => item.bookmarkId}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 16 }}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
