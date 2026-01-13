/**
 * 都道府県別スポット一覧ページ
 *
 * 指定した都道府県にあるスポットをSpotCardで表示
 * categoryIdがある場合はカテゴリでも絞り込む
 */

import React, { useCallback } from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { usePrefectureSpots, usePrefectureCategorySpots, SpotCard } from '@/entities/user-spot';
import { usePrefectures } from '@/entities/prefecture';
import { useCategories } from '@/entities/category';
import { useCurrentUserId } from '@/entities/user';
import { useSpotActions } from '@/features/spot-actions';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';
import type { SpotWithDetails } from '@/shared/types';

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

  const {
    data: spots,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = categoryId ? categoryPrefectureQuery : prefectureOnlyQuery;

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
      router.push(`/(tabs)/discover/comments/spots/${spotId}` as Href);
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

  const renderSpot = ({ item }: { item: SpotWithDetails }) => (
    <SpotCard
      spot={item}
      currentUserId={currentUserId}
      onPress={() => handleSpotPress(item.id)}
      onUserPress={handleUserPress}
      onMapPress={handleMapPress}
      onEdit={handleEditSpot}
      onDelete={handleDeleteSpot}
      onReport={handleReportSpot}
      onCommentPress={handleCommentPress}
      embeddedUser={item.user}
      embeddedMasterSpot={item.master_spot}
    />
  );

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
      ) : spots && spots.length > 0 ? (
        <FlatList
          data={spots}
          keyExtractor={(item) => item.id}
          renderItem={renderSpot}
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
    </View>
  );
}
