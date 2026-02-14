/**
 * ブックマークしたスポット一覧Widget（無限スクロール対応）
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
import { useBookmarkedSpots } from '@/entities/bookmark';
import { removeBookmark, type BookmarkedSpotItem } from '@/shared/api/supabase/bookmarks';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import { SwipeableRow, RepeatSkeleton, SpotListCardSkeleton } from '@/shared/ui';
import { SpotListCard, type SpotListCardSpot } from '@/widgets/spot-cards';
import { useDeleteSpot } from '@/entities/user-spot';
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
  const { mutate: deleteSpot } = useDeleteSpot();

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
      router.push(`/(tabs)/${currentTab}/articles/spots/${spotId}` as Href);
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

  // スポット編集
  const handleEdit = useCallback((spotId: string) => {
    router.push(`/edit-spot/${spotId}`);
  }, [router]);

  // スポット削除
  const handleDelete = useCallback((spotId: string) => {
    Alert.alert(
      t('spot.deleteSpot'),
      t('spot.deleteSpotConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteSpot(spotId),
        },
      ]
    );
  }, [t, deleteSpot]);

  // ブックマーク削除（楽観的更新）
  const handleDeleteBookmark = useCallback(
    async (bookmarkId: string) => {
      // 楽観的更新: 先にUIから削除
      const queryKey = QUERY_KEYS.bookmarkedSpots(userId, actualFolderId ?? undefined);
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
        log.error('[BookmarkedSpotList] Failed to delete bookmark:', error);
        // エラー時はロールバック
        queryClient.setQueryData(queryKey, previousData);
      }
    },
    [userId, actualFolderId, queryClient, data]
  );

  const renderItem = useCallback(
    ({ item }: { item: BookmarkedSpotItem }) => {
      // SpotListCardSpot形式に変換
      const spotData: SpotListCardSpot = {
        id: item.spot.id,
        user_id: item.spot.user_id,
        map_id: item.spot.map_id,
        name: item.spot.name,
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
            isOwner={item.spot.user_id === userId}
            onPress={() => navigateToSpot(item.spot.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUserPress={navigateToUser}
          />
        </SwipeableRow>
      );
    },
    [navigateToSpot, handleEdit, handleDelete, navigateToUser, handleDeleteBookmark, userId]
  );

  // ローディング中
  if (isLoading) {
    return <RepeatSkeleton component={SpotListCardSkeleton} count={5} />;
  }

  // ブックマークが空
  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="bookmark-outline" size={iconSizeNum['4xl']} className="text-on-surface-variant" />
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
