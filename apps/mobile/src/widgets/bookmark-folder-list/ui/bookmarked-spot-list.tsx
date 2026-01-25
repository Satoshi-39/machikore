/**
 * ブックマークしたスポット一覧Widget（無限スクロール対応）
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useCurrentTab } from '@/shared/lib';
import { useBookmarkedSpots } from '@/entities/bookmark';
import { removeBookmark, type BookmarkedSpotItem } from '@/shared/api/supabase/bookmarks';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import { SwipeableRow } from '@/shared/ui';
import { SpotListCard, type SpotListCardSpot } from '@/widgets/spot-cards';
import { useI18n } from '@/shared/lib/i18n';

interface BookmarkedSpotListProps {
  userId: string;
  folderId: string;
}

export function BookmarkedSpotList({ userId, folderId }: BookmarkedSpotListProps) {
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
  } = useBookmarkedSpots(userId, actualFolderId);

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

  // スポットへの遷移
  const navigateToSpot = useCallback(
    (spotId: string) => {
      router.push(`/(tabs)/${currentTab}/spots/${spotId}` as Href);
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
          queryKey: QUERY_KEYS.bookmarkedSpots(userId),
        });
      } catch (error) {
        log.error('[BookmarkedSpotList] Failed to delete bookmark:', error);
      }
    },
    [userId, queryClient]
  );

  const renderItem = useCallback(
    ({ item }: { item: BookmarkedSpotItem }) => {
      // SpotListCardSpot形式に変換
      const spotData: SpotListCardSpot = {
        id: item.spot.id,
        user_id: item.spot.user_id,
        map_id: item.spot.map_id,
        description: item.spot.description,
        likes_count: item.spot.likes_count,
        bookmarks_count: item.spot.bookmarks_count,
        comments_count: item.spot.comments_count,
        created_at: item.spot.created_at,
        google_short_address: item.spot.google_short_address,
        master_spot: item.spot.master_spot,
        user: item.spot.user,
        thumbnail_image: item.spot.thumbnail_image,
      };

      return (
        <SwipeableRow onDelete={() => handleDeleteBookmark(item.bookmarkId)}>
          <SpotListCard
            spot={spotData}
            currentUserId={userId}
            onPress={() => navigateToSpot(item.spot.id)}
            onUserPress={navigateToUser}
          />
        </SwipeableRow>
      );
    },
    [navigateToSpot, navigateToUser, handleDeleteBookmark, userId]
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
        <Ionicons name="bookmark-outline" size={48} className="text-on-surface-variant" />
        <Text className="text-on-surface-variant mt-4">
          {t('bookmark.noSpotBookmarks')}
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
