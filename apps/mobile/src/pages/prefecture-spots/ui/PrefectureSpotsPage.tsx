/**
 * 都道府県別スポット一覧ページ（無限スクロール対応）
 *
 * 指定した都道府県にあるスポットをSpotCardで表示
 * categoryIdがある場合はカテゴリでも絞り込む
 * 広告を一定間隔で挿入
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { usePrefectureSpots, usePrefectureCategorySpots, SpotCard } from '@/entities/user-spot';
import { usePrefectures } from '@/entities/prefecture';
import { useCategories } from '@/entities/category';
import { useCurrentUserId } from '@/entities/user';
import { useSpotActions } from '@/features/spot-actions';
import { PageHeader, MapNativeAdCard } from '@/shared/ui';
import { colors, AD_CONFIG } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';
import { insertAdsIntoList } from '@/shared/lib/admob';
import { CommentModalSheet, useCommentModal } from '@/widgets/comment-modal';
import type { SpotWithDetails, FeedItemWithAd } from '@/shared/types';

export function PrefectureSpotsPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { prefectureId, categoryId } = useLocalSearchParams<{
    prefectureId: string;
    categoryId?: string;
  }>();
  const currentUserId = useCurrentUserId();
  const { data: prefectures = [] } = usePrefectures();
  const { data: categories = [] } = useCategories();

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
    handleDelete: handleDeleteSpot,
    handleReport: handleReportSpot,
  } = useSpotActions({ currentUserId });

  // categoryIdがあればカテゴリ+都道府県検索、なければ都道府県のみ
  const prefectureOnlyQuery = usePrefectureSpots(
    prefectureId ?? '',
    currentUserId
  );
  const categoryPrefectureQuery = usePrefectureCategorySpots(
    prefectureId ?? '',
    categoryId ?? '',
    currentUserId
  );

  const query = categoryId ? categoryPrefectureQuery : prefectureOnlyQuery;
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = query;

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo(() => {
    const spots = data?.pages.flatMap((page) => page) ?? [];
    return insertAdsIntoList(spots, AD_CONFIG.FEED_AD_INTERVAL);
  }, [data]);

  const prefecture = prefectures.find((p) => p.id === prefectureId);
  const category = categories.find((c) => c.id === categoryId);
  const prefectureName = prefecture ? getTranslatedName(prefecture.name, prefecture.name_translations, locale) : '';
  const categoryName = category ? getTranslatedName(category.name, category.name_translations, locale) : '';

  const handleSpotPress = useCallback(
    (spotId: string) => {
      router.push(`/(tabs)/discover/spots/${spotId}` as Href);
    },
    [router]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/discover/users/${userId}` as Href);
    },
    [router]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  const handleCommentPress = useCallback(
    (spotId: string) => {
      openSpotCommentModal(spotId);
    },
    [openSpotCommentModal]
  );

  // コメントモーダル内でユーザーをタップした時
  const handleCommentUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/discover/users/${userId}` as Href);
    },
    [router]
  );

  if (!prefectureId) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={t('prefectureSpots.spotList')} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            {t('prefectureSpots.missingParams')}
          </Text>
        </View>
      </View>
    );
  }

  const renderItem = useCallback(
    ({ item }: { item: FeedItemWithAd<SpotWithDetails> }) => {
      if (item.type === 'ad') {
        return <MapNativeAdCard />;
      }

      const spot = item.data;
      return (
        <SpotCard
          spot={spot}
          currentUserId={currentUserId}
          onPress={() => handleSpotPress(spot.id)}
          onUserPress={handleUserPress}
          onMapPress={handleMapPress}
          onEdit={handleEditSpot}
          onDelete={handleDeleteSpot}
          onReport={handleReportSpot}
          onCommentPress={handleCommentPress}
          embeddedUser={spot.user}
          embeddedMasterSpot={spot.master_spot}
        />
      );
    },
    [currentUserId, handleSpotPress, handleUserPress, handleMapPress, handleEditSpot, handleDeleteSpot, handleReportSpot, handleCommentPress]
  );

  const getItemKey = useCallback((item: FeedItemWithAd<SpotWithDetails>) => {
    if (item.type === 'ad') return item.id;
    return item.data.id;
  }, []);

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

  // タイトルを生成
  const title = categoryId
    ? `${categoryName} - ${prefectureName}`
    : t('prefectureSpots.prefectureSpotsTitle', { prefecture: prefectureName });

  // 空メッセージを生成
  const emptyMessage = categoryId
    ? t('prefectureSpots.noCategoryPrefectureSpots', { category: categoryName, prefecture: prefectureName })
    : t('prefectureSpots.noPrefectureSpots', { prefecture: prefectureName });

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={title} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            {t('common.loading')}
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            {t('prefectureSpots.loadError')}
          </Text>
        </View>
      ) : feedItems.length > 0 ? (
        <FlashList
          data={feedItems}
          keyExtractor={getItemKey}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons
            name="location-outline"
            size={48}
            color={isDarkMode ? colors.dark.foregroundMuted : colors.text.secondary}
          />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4 text-center px-8">
            {emptyMessage}
          </Text>
        </View>
      )}

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
    </View>
  );
}
