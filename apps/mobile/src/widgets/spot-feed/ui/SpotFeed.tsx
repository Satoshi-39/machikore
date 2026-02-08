/**
 * スポットフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開スポットのフィード表示（Supabaseから取得）
 * - 無限スクロール対応
 * - 広告表示（5件ごと）
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { RefreshControl, ActivityIndicator, View, type ViewToken } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useFeedSpots, SpotCard } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { useIsPremium } from '@/entities/subscription';
import { useSpotActions } from '@/features/spot-actions';
import { AsyncBoundary, MapNativeAdCard } from '@/shared/ui';
import { AD_CONFIG } from '@/shared/config';
import { prefetchImage, prefetchSpotImages, IMAGE_PRESETS } from '@/shared/lib/image';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { useI18n } from '@/shared/lib/i18n';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';
import type { FeedItemWithAd, SpotWithDetails } from '@/shared/types';

export function SpotFeed() {
  const { t } = useI18n();
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const isPremium = useIsPremium();

  // コメントモーダル
  const {
    isVisible: isCommentModalVisible,
    target: commentTarget,
    openSpotCommentModal,
    closeCommentModal,
  } = useCommentModal();

  // スポット操作フック
  const {
    handleEdit: handleEditSpot,
    handleReport: handleReportSpot,
    handleBlock: handleBlockUser,
  } = useSpotActions({ currentUserId: currentUser?.id });

  // 無限スクロール対応のフック
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedSpots(currentUser?.id);

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo(() => {
    const spots = data?.pages.flatMap((page) => page) ?? [];
    return insertAdsIntoList(spots, AD_CONFIG.FEED_AD_INTERVAL, !isPremium);
  }, [data, isPremium]);

  // カード全体タップ時: スポット記事ページに遷移（発見タブ内スタック）
  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/discover/articles/spots/${spotId}`);
  }, [router]);

  // ユーザーアイコンタップ時: ユーザープロフィールページに遷移（発見タブ内スタック）
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/discover/users/${userId}`);
  }, [router]);

  // コメントモーダルを開く
  const handleCommentPress = useCallback((spotId: string) => {
    openSpotCommentModal(spotId);
  }, [openSpotCommentModal]);

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/discover/users/${userId}`);
  }, [router]);

  // マップ名タップ時: マップ記事へ遷移（発見タブ内スタック）
  const handleMapPress = useCallback((_spotId: string, mapId: string) => {
    router.push(`/(tabs)/discover/articles/maps/${mapId}`);
  }, [router]);

  // 下端に近づいたら次のページを取得
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 画像プリフェッチ: 表示中のアイテムから先の画像を先読み
  const prefetchedIndices = useRef<Set<number>>(new Set());
  const PREFETCH_AHEAD = 5;

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;

      const lastVisibleIndex = Math.max(
        ...viewableItems.map((item) => item.index ?? 0)
      );

      for (let i = lastVisibleIndex + 1; i <= lastVisibleIndex + PREFETCH_AHEAD; i++) {
        if (i < feedItems.length && !prefetchedIndices.current.has(i)) {
          const feedItem = feedItems[i];
          if (feedItem?.type === 'content') {
            const spot = feedItem.data;
            prefetchedIndices.current.add(i);
            // ユーザーアバターをプリフェッチ
            if (spot.user?.avatar_url) {
              prefetchImage(spot.user.avatar_url, IMAGE_PRESETS.avatar);
            }
            // スポット画像をプリフェッチ（JOINで取得済みのimage_urlsを使用）
            if (spot.image_urls && spot.image_urls.length > 0) {
              prefetchSpotImages(spot.image_urls.slice(0, 4)); // 最初の4枚のみ
            }
          }
        }
      }
    },
    [feedItems]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  // ローディングフッター
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: FeedItemWithAd<SpotWithDetails> }) => {
      if (item.type === 'ad') {
        return <MapNativeAdCard />;
      }

      const spot = item.data;
      return (
        <SpotCard
          spot={spot}
          currentUserId={currentUser?.id}
          onPress={handleSpotPress}
          onUserPress={handleUserPress}
          onMapPress={handleMapPress}
          onEdit={handleEditSpot}
          onReport={handleReportSpot}
          onBlock={handleBlockUser}
          onCommentPress={handleCommentPress}
          embeddedUser={spot.user}
          embeddedMasterSpot={spot.master_spot}
        />
      );
    },
    [currentUser?.id, handleSpotPress, handleUserPress, handleMapPress, handleEditSpot, handleReportSpot, handleBlockUser, handleCommentPress]
  );

  const getItemKey = useCallback((item: FeedItemWithAd<SpotWithDetails>) => {
    return item.type === 'ad' ? item.id : item.data.id;
  }, []);

  return (
    <>
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={feedItems.length > 0 ? feedItems : null}
        emptyMessage={t('spotFeed.noSpotsYet')}
        emptyIonIcon="location-outline"
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
