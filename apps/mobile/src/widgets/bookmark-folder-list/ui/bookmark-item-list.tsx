/**
 * ブックマークアイテム一覧Widget
 *
 * 特定フォルダ内のブックマークを表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { useBookmarks } from '@/entities/bookmark';
import { removeBookmark } from '@/shared/api/supabase/bookmarks';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import type { BookmarkWithDetails } from '@/shared/api/supabase/bookmarks';
import type { BookmarkTabMode } from '@/features/filter-bookmark-tab';
import type { MapWithUser } from '@/shared/types';
import { SwipeableRow } from '@/shared/ui';
import { MapListCard } from '@/widgets/map-cards';
import { SpotListCard, type SpotListCardSpot } from '@/widgets/spot-cards';
import { useI18n } from '@/shared/lib/i18n';

interface BookmarkItemListProps {
  userId: string;
  folderId: string;
  activeTab: BookmarkTabMode;
}

export function BookmarkItemList({
  userId,
  folderId,
  activeTab,
}: BookmarkItemListProps) {
  const router = useRouter();
  const currentTab = useCurrentTab();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const { data: allBookmarks = [] } = useBookmarks(userId, undefined);

  // 選択中のフォルダのブックマーク
  const bookmarks = useMemo(() => {
    return allBookmarks.filter((b) => {
      const matchFolder = folderId === 'uncategorized'
        ? !b.folder_id
        : b.folder_id === folderId;
      const matchType = activeTab === 'spots' ? b.user_spot_id : b.map_id;
      return matchFolder && matchType;
    });
  }, [allBookmarks, folderId, activeTab]);

  // スポットへの遷移
  const navigateToSpot = useCallback((spotId: string) => {
    router.push(`/(tabs)/${currentTab}/spots/${spotId}` as any);
  }, [router, currentTab]);

  // マップへの遷移
  const navigateToMap = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  }, [router, currentTab]);

  // ユーザープロフィールへの遷移
  const navigateToUser = useCallback((navUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${navUserId}` as Href);
  }, [router, currentTab]);

  // 記事への遷移
  const navigateToArticle = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
  }, [router, currentTab]);

  // ブックマーク削除
  const handleDeleteBookmark = useCallback(async (bookmarkId: string) => {
    try {
      await removeBookmark(bookmarkId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarksList(userId) });
    } catch (error) {
      log.error('[BookmarkItemList] Failed to delete bookmark:', error);
    }
  }, [userId, queryClient]);

  const renderBookmarkItem = useCallback(
    ({ item }: { item: BookmarkWithDetails }) => {
      if (item.spot) {
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
          <SwipeableRow onDelete={() => handleDeleteBookmark(item.id)}>
            <SpotListCard
              spot={spotData}
              currentUserId={userId}
              onPress={() => navigateToSpot(item.spot!.id)}
              onUserPress={navigateToUser}
            />
          </SwipeableRow>
        );
      }

      if (item.map) {
        return (
          <SwipeableRow onDelete={() => handleDeleteBookmark(item.id)}>
            <MapListCard
              map={item.map as MapWithUser}
              currentUserId={userId}
              isOwner={item.map.user?.id === userId}
              onPress={() => navigateToMap(item.map!.id)}
              onUserPress={navigateToUser}
              onArticlePress={navigateToArticle}
            />
          </SwipeableRow>
        );
      }

      return null;
    },
    [navigateToSpot, navigateToMap, navigateToUser, navigateToArticle, handleDeleteBookmark, userId]
  );

  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="bookmark-outline" size={48} color={colors.text.secondary} />
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">
          {activeTab === 'spots' ? t('bookmark.noSpotBookmarks') : t('bookmark.noMapBookmarks')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.id}
      renderItem={renderBookmarkItem}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}
