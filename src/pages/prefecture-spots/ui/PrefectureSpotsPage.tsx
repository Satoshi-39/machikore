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
import { usePrefectureSpots, usePrefectureCategorySpots } from '@/entities/user-spot';
import { usePrefectures } from '@/entities/prefecture';
import { useCategories } from '@/entities/category';
import { useCurrentUserId } from '@/entities/user';
import { PageHeader } from '@/shared/ui';
import { SpotCard } from '@/entities/user-spot';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import type { SpotWithDetails } from '@/shared/types';

export function PrefectureSpotsPage() {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const { prefectureId, categoryId } = useLocalSearchParams<{
    prefectureId: string;
    categoryId?: string;
  }>();
  const currentUserId = useCurrentUserId();
  const { data: prefectures = [] } = usePrefectures();
  const { data: categories = [] } = useCategories();

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

  const prefectureName =
    prefectures.find((p) => p.id === prefectureId)?.name ?? '';
  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? '';

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
        <PageHeader title="スポット一覧" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            パラメータが不足しています
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
      onCommentPress={handleCommentPress}
      embeddedUser={item.user}
      embeddedMasterSpot={item.master_spot}
    />
  );

  // タイトルを生成
  const title = categoryId
    ? `${categoryName} - ${prefectureName}`
    : `${prefectureName}のスポット`;

  // 空メッセージを生成
  const emptyMessage = categoryId
    ? `${categoryName}の${prefectureName}スポットはまだありません`
    : `${prefectureName}のスポットはまだありません`;

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={title} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込み中...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込みに失敗しました
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
