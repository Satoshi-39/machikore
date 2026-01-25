/**
 * 汎用マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 様々なデータソースに対応（おすすめ、フォロー中、発見など）
 * - 無限スクロール対応
 * - 広告表示（5件ごと）
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { RefreshControl, ActivityIndicator, View, Text, type ViewToken } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { useMapActions } from '@/features/map-actions';
import { AsyncBoundary, MapNativeAdCard } from '@/shared/ui';
import { AD_CONFIG, FEED_PAGE_SIZE } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { prefetchMapCards } from '@/shared/lib/image';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';
import type { MapWithUser, FeedItemWithAd } from '@/shared/types';

type TabName = 'home' | 'discover' | 'mypage' | 'notifications';

interface MapFeedProps {
  /** データ取得関数（cursor方式） */
  fetchMaps: (limit: number, cursor?: string) => Promise<MapWithUser[]>;
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

  // コメントモーダル
  const {
    isVisible: isCommentModalVisible,
    target: commentTarget,
    openMapCommentModal,
    closeCommentModal,
  } = useCommentModal();

  // マップ操作フック
  const {
    handleEdit: handleEditMap,
    handleDelete: handleDeleteMap,
    handleReport: handleReportMap,
  } = useMapActions({ currentUserId: userId });

  // 無限スクロール対応のマップ取得（cursor方式）
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
    queryFn: async ({ pageParam }) => fetchMaps(FEED_PAGE_SIZE, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // 取得した件数がFEED_PAGE_SIZE未満なら次のページはない
      if (lastPage.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      // 最後のアイテムのcreated_atをcursorとして返す
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.created_at;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled: !requireAuth || !!userId, // 認証必須の場合はログイン時のみ有効
  });

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo(() => {
    const maps = data?.pages.flatMap((page) => page) ?? [];
    return insertAdsIntoList(maps, AD_CONFIG.FEED_AD_INTERVAL);
  }, [data]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/maps/${mapId}`);
  }, [router, tabName]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${tabName}/users/${userId}`);
  }, [router, tabName]);

  const handleCommentPress = useCallback((mapId: string) => {
    openMapCommentModal(mapId);
  }, [openMapCommentModal]);

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback((pressedUserId: string) => {
    router.push(`/(tabs)/${tabName}/users/${pressedUserId}`);
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

  // 画像プリフェッチ: 表示中のアイテムから先の画像を先読み
  const prefetchedIndices = useRef<Set<number>>(new Set());
  const PREFETCH_AHEAD = 5; // 5件先まで先読み

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;

      // 最後に表示されているアイテムのインデックスを取得
      const lastVisibleIndex = Math.max(
        ...viewableItems.map((item) => item.index ?? 0)
      );

      // 先読み対象のマップを収集
      const mapsToPrefetch: MapWithUser[] = [];

      for (let i = lastVisibleIndex + 1; i <= lastVisibleIndex + PREFETCH_AHEAD; i++) {
        if (i < feedItems.length && !prefetchedIndices.current.has(i)) {
          const item = feedItems[i];
          if (item?.type === 'content') {
            mapsToPrefetch.push(item.data);
            prefetchedIndices.current.add(i);
          }
        }
      }

      // バックグラウンドでプリフェッチ
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
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  // 未ログイン時の表示（認証必須の場合）
  if (requireAuth && !userId) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-on-surface-variant text-center">
          {unauthMessage || t('empty.noFollowingUsers')}
        </Text>
      </View>
    );
  }

  // フィードアイテムのレンダリング
  const renderItem = useCallback(
    ({ item }: { item: FeedItemWithAd<MapWithUser> }) => {
      if (item.type === 'ad') {
        return <MapNativeAdCard />;
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

  const getItemKey = useCallback((item: FeedItemWithAd<MapWithUser>) => {
    return item.type === 'ad' ? item.id : item.data.id;
  }, []);

  return (
    <>
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

      {/* コメントモーダル */}
      {commentTarget && (
        <CommentModalSheet
          visible={isCommentModalVisible}
          type={commentTarget.type}
          targetId={commentTarget.id}
          onClose={closeCommentModal}
          onUserPress={handleCommentUserPress}
          autoFocus={commentTarget.options?.autoFocus}
          focusCommentId={commentTarget.options?.focusCommentId}
        />
      )}
    </>
  );
}
