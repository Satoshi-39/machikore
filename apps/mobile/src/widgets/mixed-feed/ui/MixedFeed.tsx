/**
 * 混合フィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - マップとスポットを混合して新着順で表示
 * - 無限スクロール対応
 * - 広告表示
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { RefreshControl, ActivityIndicator, View, Text, type ViewToken } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { MapCard } from '@/entities/map';
import { SpotCard } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { useMixedFeed, useFollowingMixedFeed, type MixedFeedItem } from '@/entities/mixed-feed';
import { useMapActions } from '@/features/map-actions';
import { useSpotActions } from '@/features/spot-actions';
import { AsyncBoundary, NativeAdCard } from '@/shared/ui';
import { colors, AD_CONFIG } from '@/shared/config';
import { prefetchMapCards } from '@/shared/lib/image';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { useI18n } from '@/shared/lib/i18n';
import type { MapWithUser, SpotWithDetails, FeedItemWithAd } from '@/shared/types';

type TabName = 'home' | 'discover' | 'mypage' | 'notifications';
type FeedMode = 'recommend' | 'following';

interface MixedFeedProps {
  /** ルーティング先のタブ名 */
  tabName: TabName;
  /** フィードモード（おすすめ or フォロー中） */
  mode?: FeedMode;
  /** 空の場合のメッセージ */
  emptyMessage: string;
  /** 空の場合のアイコン */
  emptyIcon?: string;
  /** ログイン必須かどうか（フォロー中タブ用） */
  requireAuth?: boolean;
  /** 未ログイン時のメッセージ */
  unauthMessage?: string;
}

export function MixedFeed({
  tabName,
  mode = 'recommend',
  emptyMessage,
  emptyIcon = 'albums-outline',
  requireAuth = false,
  unauthMessage,
}: MixedFeedProps) {
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

  // スポット操作フック
  const {
    handleEdit: handleEditSpot,
    handleDelete: handleDeleteSpot,
    handleReport: handleReportSpot,
  } = useSpotActions({ currentUserId: userId });

  // モードに応じてクエリを選択（不要なクエリは実行しない）
  const isFollowingMode = mode === 'following';

  const recommendQuery = useMixedFeed({
    currentUserId: userId,
    enabled: !isFollowingMode,
  });

  const followingQuery = useFollowingMixedFeed({
    userId,
    enabled: isFollowingMode,
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = isFollowingMode ? followingQuery : recommendQuery;

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

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo(() => {
    const items = data?.pages.flatMap((page) => page) ?? [];
    return insertAdsIntoList(items, AD_CONFIG.FEED_AD_INTERVAL);
  }, [data]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/maps/${mapId}`);
  }, [router, tabName]);

  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${tabName}/spots/${spotId}`);
  }, [router, tabName]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${tabName}/users/${userId}`);
  }, [router, tabName]);

  const handleMapCommentPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/comment-modal/maps/${mapId}`);
  }, [router, tabName]);

  const handleSpotCommentPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${tabName}/comment-modal/spots/${spotId}`);
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

  // 画像プリフェッチ
  const prefetchedIndices = useRef<Set<number>>(new Set());
  const PREFETCH_AHEAD = 5;

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;

      const lastVisibleIndex = Math.max(
        ...viewableItems.map((item) => item.index ?? 0)
      );

      const mapsToPrefetch: MapWithUser[] = [];

      for (let i = lastVisibleIndex + 1; i <= lastVisibleIndex + PREFETCH_AHEAD; i++) {
        if (i < feedItems.length && !prefetchedIndices.current.has(i)) {
          const item = feedItems[i];
          if (item?.type === 'content' && item.data.type === 'map') {
            mapsToPrefetch.push(item.data.data as MapWithUser);
            prefetchedIndices.current.add(i);
          }
        }
      }

      if (mapsToPrefetch.length > 0) {
        prefetchMapCards(mapsToPrefetch);
      }
    },
    [feedItems]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

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
    ({ item }: { item: FeedItemWithAd<MixedFeedItem> }) => {
      if (item.type === 'ad') {
        return <NativeAdCard />;
      }

      const mixedItem = item.data;

      if (mixedItem.type === 'map') {
        return (
          <MapCard
            map={mixedItem.data as MapWithUser}
            currentUserId={userId}
            onPress={() => handleMapPress(mixedItem.data.id)}
            onUserPress={handleUserPress}
            onEdit={handleEditMap}
            onDelete={handleDeleteMap}
            onReport={handleReportMap}
            onCommentPress={handleMapCommentPress}
            onArticlePress={handleArticlePress}
            onTagPress={handleTagPress}
          />
        );
      }

      return (
        <SpotCard
          spot={mixedItem.data as SpotWithDetails}
          currentUserId={userId}
          onPress={() => handleSpotPress(mixedItem.data.id)}
          onUserPress={handleUserPress}
          onMapPress={handleMapPress}
          onEdit={handleEditSpot}
          onDelete={handleDeleteSpot}
          onReport={handleReportSpot}
          onCommentPress={handleSpotCommentPress}
          onTagPress={handleTagPress}
        />
      );
    },
    [
      userId,
      handleMapPress,
      handleSpotPress,
      handleUserPress,
      handleEditMap,
      handleDeleteMap,
      handleReportMap,
      handleMapCommentPress,
      handleArticlePress,
      handleTagPress,
      handleEditSpot,
      handleDeleteSpot,
      handleReportSpot,
      handleSpotCommentPress,
    ]
  );

  const getItemKey = useCallback((item: FeedItemWithAd<MixedFeedItem>) => {
    if (item.type === 'ad') return item.id;
    return `${item.data.type}-${item.data.data.id}`;
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
        <FlashList
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
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      )}
    </AsyncBoundary>
  );
}
