/**
 * 混合フィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - サーバーからfeed_position順で返されるフラットリストを使用
 * - MapCardを縦スクロールで表示
 * - 連続するスポット+carousel_video広告をカルーセルにグループ化
 * - 無限スクロール対応
 * - 広告表示（feed_native: ネイティブ広告、carousel_video: 動画広告）
 * - スポット表示タイプ（card/short）はサーバー側でブロックごとに交互設定
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { RefreshControl, ActivityIndicator, View, Text, type ViewToken } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import {
  useMixedFeed,
  useFollowingMixedFeed,
  type SpotDisplayType,
} from '@/entities/mixed-feed';
import { useMapActions } from '@/features/map-actions';
import { useSpotActions } from '@/features/spot-actions';
import { AsyncBoundary, MapNativeAdCard } from '@/shared/ui';
import { AD_SLOTS } from '@/shared/config';
import { prefetchMapCards } from '@/shared/lib/image';
import { useI18n } from '@/shared/lib/i18n';
import { SpotCardCarousel } from '@/widgets/spot-card-carousel';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';
import type { MapWithUser, SpotWithDetails } from '@/shared/types';

type TabName = 'home' | 'discover' | 'mypage' | 'notifications';
type FeedMode = 'recommend' | 'following';

/** UIに表示するフィードアイテムの種類 */
type UIFeedItem =
  | { type: 'map'; data: MapWithUser; key: string }
  | { type: 'ad-native'; key: string }
  | { type: 'spot-carousel'; spots: SpotWithDetails[]; hasVideoAd: boolean; displayType: SpotDisplayType; key: string };

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

  // コメントモーダル
  const {
    isVisible: isCommentModalVisible,
    target: commentTarget,
    openSpotCommentModal,
    openMapCommentModal,
    closeCommentModal,
  } = useCommentModal();

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
        <Text className="text-on-surface-variant text-center">
          {unauthMessage || t('empty.noFollowingUsers')}
        </Text>
      </View>
    );
  }

  // サーバーからのフラットリストをUIアイテムに変換
  // 連続するspot + carousel_video広告をカルーセルにグループ化
  // displayTypeは各spotが持っている（サーバー側でブロックごとにshort/card交互に設定）
  const feedItems = useMemo(() => {
    const rawItems = data?.pages.flatMap((page) => page) ?? [];
    const uiItems: UIFeedItem[] = [];

    let i = 0;
    while (i < rawItems.length) {
      const item = rawItems[i]!;

      if (item.type === 'map') {
        // マップはそのまま追加
        uiItems.push({
          type: 'map',
          data: item.data as MapWithUser,
          key: `map-${(item.data as MapWithUser).id}`,
        });
        i++;
      } else if (item.type === 'ad') {
        if (item.adSlot === AD_SLOTS.FEED_NATIVE) {
          // ネイティブ広告はそのまま追加
          uiItems.push({
            type: 'ad-native',
            key: `ad-native-${item.feedPosition}`,
          });
        }
        // carousel_video広告はspotグループで処理されるのでここではスキップ
        i++;
      } else if (item.type === 'spot') {
        // スポットのグループ化（carousel_video広告も含む）
        // 最初のスポットのdisplayTypeをカルーセル全体に適用
        const displayType: SpotDisplayType = item.displayType;
        const carouselSpots: SpotWithDetails[] = [];
        let hasVideoAd = false;
        const startPosition = i;

        while (i < rawItems.length) {
          const current = rawItems[i]!;
          if (current.type === 'spot') {
            carouselSpots.push(current.data as SpotWithDetails);
            i++;
          } else if (current.type === 'ad' && current.adSlot === AD_SLOTS.CAROUSEL_VIDEO) {
            hasVideoAd = true;
            i++;
          } else {
            break;
          }
        }

        if (carouselSpots.length > 0) {
          uiItems.push({
            type: 'spot-carousel',
            spots: carouselSpots,
            hasVideoAd,
            displayType,
            key: `spot-carousel-${startPosition}`,
          });
        }
      } else {
        // 未知のタイプはスキップ
        i++;
      }
    }

    return uiItems;
  }, [data]);

  // MapCard内のマップアイコンタップ → マップ詳細へ
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${tabName}/maps/${mapId}`);
  }, [router, tabName]);

  // SpotCard全体タップ → スポット記事へ
  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${tabName}/articles/spots/${spotId}`);
  }, [router, tabName]);

  // SpotCard内のマップアイコンタップ → マップ内スポットへ
  const handleSpotMapPress = useCallback((spotId: string, mapId: string) => {
    router.push(`/(tabs)/${tabName}/maps/${mapId}/spots/${spotId}`);
  }, [router, tabName]);

  const handleUserPress = useCallback((pressedUserId: string) => {
    router.push(`/(tabs)/${tabName}/users/${pressedUserId}`);
  }, [router, tabName]);

  const handleMapCommentPress = useCallback((mapId: string) => {
    openMapCommentModal(mapId);
  }, [openMapCommentModal]);

  const handleSpotCommentPress = useCallback((spotId: string) => {
    openSpotCommentModal(spotId);
  }, [openSpotCommentModal]);

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback((pressedUserId: string) => {
    router.push(`/(tabs)/${tabName}/users/${pressedUserId}`);
  }, [router, tabName]);

  const handleMapArticlePress = useCallback((mapId: string) => {
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
  const prefetchedKeys = useRef<Set<string>>(new Set());
  const PREFETCH_AHEAD = 5;

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;

      const lastVisibleIndex = Math.max(
        ...viewableItems.map((item) => item.index ?? 0)
      );

      const mapsToPrefetch: MapWithUser[] = [];

      for (let i = lastVisibleIndex + 1; i <= lastVisibleIndex + PREFETCH_AHEAD; i++) {
        if (i < feedItems.length) {
          const item = feedItems[i];
          if (item?.type === 'map' && !prefetchedKeys.current.has(item.key)) {
            mapsToPrefetch.push(item.data);
            prefetchedKeys.current.add(item.key);
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
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  // フィードアイテムのレンダリング
  const renderItem = useCallback(
    ({ item }: { item: UIFeedItem }) => {
      switch (item.type) {
        case 'ad-native':
          return <MapNativeAdCard />;

        case 'map':
          return (
            <MapCard
              map={item.data}
              currentUserId={userId}
              onPress={() => handleMapPress(item.data.id)}
              onUserPress={handleUserPress}
              onEdit={handleEditMap}
              onReport={handleReportMap}
              onCommentPress={handleMapCommentPress}
              onArticlePress={handleMapArticlePress}
              onTagPress={handleTagPress}
            />
          );

        case 'spot-carousel':
          // 常にSpotCardCarouselを使用（ショートはフェーズ2で対応）
          return (
            <SpotCardCarousel
              title={t('feed.sections.spot')}
              spots={item.spots}
              currentUserId={userId}
              onSpotPress={handleSpotPress}
              onUserPress={handleUserPress}
              onMapPress={handleSpotMapPress}
              onCommentPress={handleSpotCommentPress}
              onTagPress={handleTagPress}
              onEdit={handleEditSpot}
              onReport={handleReportSpot}
              showVideoAd={item.hasVideoAd}
            />
          );

        default:
          return null;
      }
    },
    [
      userId,
      handleMapPress,
      handleSpotPress,
      handleSpotMapPress,
      handleUserPress,
      handleEditMap,
      handleDeleteMap,
      handleReportMap,
      handleMapCommentPress,
      handleMapArticlePress,
      handleTagPress,
      handleEditSpot,
      handleDeleteSpot,
      handleReportSpot,
      handleSpotCommentPress,
    ]
  );

  const getItemKey = useCallback((item: UIFeedItem) => item.key, []);

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
