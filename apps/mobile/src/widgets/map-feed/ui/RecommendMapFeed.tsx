/**
 * おすすめマップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開マップのフィード表示（おすすめ）
 * - 無限スクロール対応
 * - 広告表示（5件ごと）
 * - 将来的にはレコメンドロジック、人気順などに拡張可能
 */

import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary, NativeAdCard } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getPublicMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

const PAGE_SIZE = 10;

/** 広告を挿入する間隔（マップ5件ごとに1広告） */
const AD_INTERVAL = 5;

type FeedItem =
  | { type: 'map'; data: MapWithUser }
  | { type: 'ad'; id: string };

export function RecommendMapFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const { t } = useI18n();

  // おすすめマップ取得（公開マップ一覧）
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
    queryKey: [...QUERY_KEYS.maps, 'feed', 'recommend'],
    queryFn: ({ pageParam = 0 }) => getPublicMaps(PAGE_SIZE, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length * PAGE_SIZE;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo((): FeedItem[] => {
    const maps = data?.pages.flatMap((page) => page) ?? [];
    const items: FeedItem[] = [];

    maps.forEach((map, index) => {
      items.push({ type: 'map', data: map });

      // AD_INTERVAL件ごとに広告を挿入（最後のアイテムの後には挿入しない）
      if ((index + 1) % AD_INTERVAL === 0 && index < maps.length - 1) {
        items.push({ type: 'ad', id: `ad-${index}` });
      }
    });

    return items;
  }, [data]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/home/maps/${mapId}`);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/home/users/${userId}`);
  }, [router]);

  const handleEditMap = useCallback((mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  }, [router]);

  // コメントモーダルを開く
  const handleCommentPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/home/comment-modal/maps/${mapId}`);
  }, [router]);

  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/home/articles/maps/${mapId}`);
  }, [router]);

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
          onCommentPress={handleCommentPress}
          onArticlePress={handleArticlePress}
        />
      );
    },
    [currentUser?.id, handleMapPress, handleUserPress, handleEditMap, handleCommentPress, handleArticlePress]
  );

  const getItemKey = useCallback((item: FeedItem) => {
    return item.type === 'ad' ? item.id : item.data.id;
  }, []);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={feedItems.length > 0 ? feedItems : null}
      emptyMessage={t('empty.noMaps')}
      emptyIonIcon="map-outline"
    >
      {(items) => (
        <>
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
        </>
      )}
    </AsyncBoundary>
  );
}
