/**
 * ブックマークしたマップ一覧Widget（無限スクロール対応）
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Alert, ActivityIndicator, RefreshControl } from 'react-native';
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
import { RepeatSkeleton, MapListCardSkeleton } from '@/shared/ui/skeleton';
import { MapListCard } from '@/widgets/map-cards';
import { useDeleteMap } from '@/entities/map';
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
  const { mutate: deleteMap } = useDeleteMap();

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

  // マップ編集
  const handleEdit = useCallback((mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  }, [router]);

  // マップ削除
  const handleDelete = useCallback((mapId: string) => {
    Alert.alert(
      t('map.deleteMap'),
      t('mypage.deleteMapConfirmDetail'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteMap(mapId),
        },
      ]
    );
  }, [t, deleteMap]);

  // ブックマーク削除（楽観的更新）
  const handleDeleteBookmark = useCallback(
    async (bookmarkId: string) => {
      // 楽観的更新: 先にUIから削除
      const queryKey = QUERY_KEYS.bookmarkedMaps(userId, actualFolderId ?? undefined);
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldData: typeof data) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.filter((item) => item.bookmarkId !== bookmarkId)
            ),
          };
        }
      );

      try {
        await removeBookmark(bookmarkId);
        // フォルダカウントも更新
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.folderBookmarkCounts(userId),
        });
      } catch (error) {
        log.error('[BookmarkedMapList] Failed to delete bookmark:', error);
        // エラー時はロールバック
        queryClient.setQueryData(queryKey, previousData);
      }
    },
    [userId, actualFolderId, queryClient, data]
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUserPress={navigateToUser}
            onMapPress={navigateToMap}
          />
        </SwipeableRow>
      );
    },
    [navigateToArticle, handleEdit, handleDelete, navigateToUser, navigateToMap, handleDeleteBookmark, userId]
  );

  // ローディング中
  if (isLoading) {
    return <RepeatSkeleton component={MapListCardSkeleton} count={4} />;
  }

  // ブックマークが空
  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="bookmark-outline" size={iconSizeNum['4xl']} className="text-on-surface-variant" />
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
