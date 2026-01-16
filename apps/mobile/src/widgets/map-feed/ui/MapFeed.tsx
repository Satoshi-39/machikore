/**
 * 汎用マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 様々なデータソースに対応（おすすめ、フォロー中、発見など）
 * - 無限スクロール対応
 * - 広告表示（5件ごと）
 */

import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useMapActions } from '@/features/map-actions';
import { AsyncBoundary, NativeAdCard } from '@/shared/ui';
import { colors, AD_CONFIG } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import type { MapWithUser } from '@/shared/types';

const PAGE_SIZE = 10;

type FeedItem =
  | { type: 'map'; data: MapWithUser }
  | { type: 'ad'; id: string };

type TabName = 'home' | 'discover' | 'mypage' | 'notifications';

interface MapFeedProps {
  /** データ取得関数 */
  fetchMaps: (limit: number, offset: number) => Promise<MapWithUser[]>;
  /** Query Key */
  queryKey: readonly unknown[];
  /** ルーティング先のタブ名 */
  tabName: TabName;
  /** 空の場合のメッセージ */
  emptyMessage: string;
  /** 空の場合のアイコン */
  emptyIcon?: string;
  /** ログイン必須かどうか */
  requireAuth?: boolean;
  /** 未ログイン時のメッセージ */
  unauthMessage?: string;
}

export function MapFeed({
  fetchMaps,
  queryKey,
  tabName,
  emptyMessage,
  emptyIcon = 'map-outline',
  requireAuth = false,
  unauthMessage,
}: MapFeedProps) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const userId = currentUser?.id;
  const { t } = useI18n();

  // マップ操作フック
  const {
    handleEdit: handleEditMap,
    handleDelete: handleDeleteMap,
    handleReport: handleReportMap,
  } = useMapActions({ currentUserId: userId });

  // 無限スクロール対応のマップ取得
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MapWithUser[], Error>({
    queryKey,
    queryFn: ({ pageParam = 0 }) => fetchMaps(PAGE_SIZE, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length * PAGE_SIZE;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled: !requireAuth || !!userId, // 認証必須の場合はログイン時のみ有効
  });

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo((): FeedItem[] => {
    const maps = data?.pages.flatMap((page) => page) ?? [];
    const items: FeedItem[] = [];

    maps.forEach((map, index) => {
      items.push({ type: 'map', data: map });

      // FEED_AD_INTERVAL件ごとに広告を挿入（最後のアイテムの後には挿入しない）
      if ((index + 1) % AD_CONFIG.FEED_AD_INTERVAL === 0 && index < maps.length - 1) {
        items.push({ type: 'ad', id: `ad-${index}` });
      }
    });

    return items;
  }, [data]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/maps/${mapId}`);
  }, [router, tabName]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${tabName}/users/${userId}`);
  }, [router, tabName]);

  const handleCommentPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/comment-modal/maps/${mapId}`);
  }, [router, tabName]);

  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/articles/maps/${mapId}`);
  }, [router, tabName]);

  const handleTagPress = useCallback((tagName: string) => {
    router.push(`/(tabs)/${tabName}/search?tag=${encodeURIComponent(tagName)}`);
  }, [router, tabName]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }, [isFetchingNextPage]);

  // 未ログイン時の表示（認証必須の場合）
  if (requireAuth && !userId) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-center">
          {unauthMessage || t('empty.noFollowingUsers')}
        </Text>
      </View>
    );
  }

  // フィードアイテムのレンダリング
  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => {
      if (item.type === 'ad') {
        return <NativeAdCard />;
      }

      return (
        <MapCard
          map={item.data}
          currentUserId={currentUser?.id}
          onPress={() => handleMapPress(item.data.id)}
          onUserPress={handleUserPress}
          onEdit={handleEditMap}
          onDelete={handleDeleteMap}
          onReport={handleReportMap}
          onCommentPress={handleCommentPress}
          onArticlePress={handleArticlePress}
          onTagPress={handleTagPress}
        />
      );
    },
    [currentUser?.id, handleMapPress, handleUserPress, handleEditMap, handleDeleteMap, handleReportMap, handleCommentPress, handleArticlePress, handleTagPress]
  );

  const getItemKey = useCallback((item: FeedItem) => {
    return item.type === 'ad' ? item.id : item.data.id;
  }, []);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={feedItems.length > 0 ? feedItems : null}
      emptyMessage={emptyMessage}
      emptyIonIcon={emptyIcon}
    >
      {(items) => (
        <FlatList
          data={items}
          keyExtractor={getItemKey}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </AsyncBoundary>
  );
}
