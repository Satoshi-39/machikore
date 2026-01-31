/**
 * コレクション詳細ページ
 *
 * コレクション内のマップ一覧を表示
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadiusNum, avatarSizeNum, iconSizeNum } from '@/shared/config';
import { getOptimizedImageUrl, IMAGE_PRESETS } from '@/shared/lib/image';
import { useCollection, useCollectionMaps } from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { useCurrentTab } from '@/shared/lib/navigation';
import { PageHeader, Loading, ErrorView } from '@/shared/ui';
import { MapListCard } from '@/widgets/map-cards';
import type { CollectionMapWithDetails } from '@/shared/api/supabase/collections';
import type { MapWithUser } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';

interface CollectionDetailPageProps {
  collectionId: string;
}

export function CollectionDetailPage({ collectionId }: CollectionDetailPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  const { data: collection, isLoading: isLoadingCollection, error: collectionError } = useCollection(collectionId);
  const {
    data: collectionMapsData,
    isLoading: isLoadingMaps,
    error: mapsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useCollectionMaps(collectionId);

  // ページデータをフラット化
  const collectionMaps = useMemo(
    () => collectionMapsData?.pages.flatMap((page) => page) ?? [],
    [collectionMapsData]
  );

  const isOwner = collection?.user_id === currentUserId;
  const isLoading = isLoadingCollection || isLoadingMaps;
  const error = collectionError || mapsError;

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

  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
  }, [router, currentTab]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
  }, [router, currentTab]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
  }, [router, currentTab]);

  const handleEdit = useCallback(() => {
    router.push(`/edit-collection/${collectionId}` as Href);
  }, [router, collectionId]);

  // CollectionMapWithDetails.map を MapWithUser として扱うためのヘルパー
  const toMapWithUser = (item: CollectionMapWithDetails): MapWithUser | null => {
    if (!item.map) return null;
    return item.map as unknown as MapWithUser;
  };

  const renderHeader = useCallback(() => {
    if (!collection) return null;
    return (
      <View className="bg-surface border-b-thin border-outline-variant">
        {/* コレクション情報 */}
        <View className="px-4 py-4">
          <View className="flex-row items-start">
            {/* サムネイル */}
            {collection.thumbnail_url ? (
              <Image
                source={{ uri: getOptimizedImageUrl(collection.thumbnail_url, IMAGE_PRESETS.mapThumbnailSmall) || collection.thumbnail_url }}
                style={{ width: 80, height: 80, borderRadius: borderRadiusNum.lg, marginRight: 16 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <View
                className="w-20 h-20 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.primitive.gray[100] }}
              >
                <Ionicons
                  name="grid"
                  size={iconSizeNum.xl}
                  className="text-primary"
                />
              </View>
            )}

            {/* テキスト情報 */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-on-surface mb-1">
                {collection.name}
              </Text>
              {collection.description && (
                <Text className="text-sm text-on-surface-variant mb-2" numberOfLines={3}>
                  {collection.description}
                </Text>
              )}
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="map" size={iconSizeNum.xs} className="text-on-surface-variant" />
                  <Text className="text-xs text-on-surface-variant">
                    {t('collection.mapsCount', { count: collection.maps_count })}
                  </Text>
                </View>
                {!collection.is_public && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="lock-closed" size={iconSizeNum.xs} className="text-on-surface-variant" />
                    <Text className="text-xs text-on-surface-variant">{t('collection.private')}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 作成者情報 */}
          {collection.user && (
            <Pressable
              onPress={() => handleUserPress(collection.user_id)}
              className="flex-row items-center mt-4"
            >
              {collection.user.avatar_url ? (
                <Image
                  source={{ uri: getOptimizedImageUrl(collection.user.avatar_url, IMAGE_PRESETS.avatar) || collection.user.avatar_url }}
                  style={{ width: avatarSizeNum.md, height: avatarSizeNum.md, borderRadius: avatarSizeNum.md / 2, marginRight: 8 }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
                  <Ionicons name="person" size={iconSizeNum.sm} className="text-gray-400" />
                </View>
              )}
              <Text className="text-sm text-on-surface-variant">
                {collection.user.display_name || collection.user.username || t('collection.anonymous')}
              </Text>
            </Pressable>
          )}
        </View>

      </View>
    );
  }, [collection, handleUserPress]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('collection.collection')} />
        <Loading message={t('common.loading')} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('collection.collection')} />
        <ErrorView error={error} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader
        title={t('collection.collection')}
        rightComponent={
          isOwner ? (
            <Pressable onPress={handleEdit} className="py-2">
              <Text className="text-base font-semibold text-on-surface">{t('collection.edit')}</Text>
            </Pressable>
          ) : undefined
        }
      />

      <FlashList
        data={collectionMaps}
        keyExtractor={(item: CollectionMapWithDetails) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }: { item: CollectionMapWithDetails }) => {
          const map = toMapWithUser(item);
          if (!map) return null;
          return (
            <MapListCard
              map={map}
              currentUserId={currentUserId}
              isOwner={false}
              onPress={() => handleArticlePress(map.id)}
              onMapPress={handleMapPress}
              onUserPress={handleUserPress}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 16 }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Ionicons name="map-outline" size={iconSizeNum['3xl']} className="text-gray-300" />
            <Text className="text-on-surface-variant mt-4">{t('collection.noMaps')}</Text>
          </View>
        }
      />
    </View>
  );
}
