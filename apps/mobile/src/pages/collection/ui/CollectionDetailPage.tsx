/**
 * コレクション詳細ページ
 *
 * コレクション内のマップ一覧を表示
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
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
  const { data: collectionMaps, isLoading: isLoadingMaps, error: mapsError } = useCollectionMaps(collectionId);

  const isOwner = collection?.user_id === currentUserId;
  const isLoading = isLoadingCollection || isLoadingMaps;
  const error = collectionError || mapsError;

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
  }, [router, currentTab]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
  }, [router, currentTab]);

  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
  }, [router, currentTab]);

  const handleEdit = useCallback(() => {
    router.push(`/edit-collection/${collectionId}` as any);
  }, [router, collectionId]);

  // CollectionMapWithDetails.map を MapWithUser として扱うためのヘルパー
  const toMapWithUser = (item: CollectionMapWithDetails): MapWithUser | null => {
    if (!item.map) return null;
    return item.map as unknown as MapWithUser;
  };

  const renderHeader = useCallback(() => {
    if (!collection) return null;
    return (
      <View className="bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light">
        {/* コレクション情報 */}
        <View className="px-4 py-4">
          <View className="flex-row items-start">
            {/* サムネイル */}
            {collection.thumbnail_url ? (
              <Image
                source={{ uri: collection.thumbnail_url }}
                style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <View
                className="w-20 h-20 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: colors.gray[100] }}
              >
                <Ionicons
                  name="grid"
                  size={32}
                  color={colors.primary.DEFAULT}
                />
              </View>
            )}

            {/* テキスト情報 */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground dark:text-dark-foreground mb-1">
                {collection.name}
              </Text>
              {collection.description && (
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-2" numberOfLines={3}>
                  {collection.description}
                </Text>
              )}
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="map" size={14} color={colors.text.secondary} />
                  <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">
                    {t('collection.mapsCount', { count: collection.maps_count })}
                  </Text>
                </View>
                {!collection.is_public && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="lock-closed" size={14} color={colors.text.secondary} />
                    <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{t('collection.private')}</Text>
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
                  source={{ uri: collection.user.avatar_url }}
                  style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              ) : (
                <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
                  <Ionicons name="person" size={16} color={colors.gray[400]} />
                </View>
              )}
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {collection.user.display_name || collection.user.username || t('collection.anonymous')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* セクションヘッダー */}
        <View className="px-4 py-2 bg-background-secondary dark:bg-dark-background-secondary border-t border-border-light dark:border-dark-border-light">
          <Text className="text-sm font-semibold text-foreground-secondary dark:text-dark-foreground-secondary">
            {t('collection.mapList')}
          </Text>
        </View>
      </View>
    );
  }, [collection, handleUserPress]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
        <PageHeader title={t('collection.collection')} />
        <Loading message={t('common.loading')} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
        <PageHeader title={t('collection.collection')} />
        <ErrorView error={error} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader
        title={t('collection.collection')}
        rightComponent={
          isOwner ? (
            <Pressable onPress={handleEdit} className="py-2">
              <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">{t('collection.edit')}</Text>
            </Pressable>
          ) : undefined
        }
      />

      <FlatList
        data={collectionMaps || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => {
          const map = toMapWithUser(item);
          if (!map) return null;
          return (
            <MapListCard
              map={map}
              currentUserId={currentUserId}
              isOwner={false}
              onPress={() => handleMapPress(map.id)}
              onArticlePress={handleArticlePress}
              onUserPress={handleUserPress}
            />
          );
        }}
        contentContainerClassName="bg-surface dark:bg-dark-surface flex-grow"
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Ionicons name="map-outline" size={48} color={colors.gray[300]} />
            <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">{t('collection.noMaps')}</Text>
          </View>
        }
      />
    </View>
  );
}
