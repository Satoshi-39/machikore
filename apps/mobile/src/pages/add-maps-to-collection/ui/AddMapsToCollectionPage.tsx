/**
 * コレクションにマップを追加するページ
 *
 * ユーザーの所有するマップ一覧から選択してコレクションに追加
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCollection, useCollectionMaps, useAddMapToCollection, useRemoveMapFromCollection } from '@/entities/collection';
import { useUserMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { getThumbnailHeight } from '@/shared/config';
import { PageHeader, MapThumbnail } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';

export function AddMapsToCollectionPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { id: collectionId } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useCurrentUserId();

  const { data: collection, isLoading: isLoadingCollection } = useCollection(collectionId);
  const { data: collectionMaps, isLoading: isLoadingCollectionMaps } = useCollectionMaps(collectionId);
  const { data: userMaps, isLoading: isLoadingUserMaps } = useUserMaps(currentUserId);
  const { mutate: addMap, isPending: isAdding } = useAddMapToCollection();
  const { mutate: removeMap, isPending: isRemoving } = useRemoveMapFromCollection();

  const isLoading = isLoadingCollection || isLoadingCollectionMaps || isLoadingUserMaps;
  const isMutating = isAdding || isRemoving;

  // コレクションに含まれているマップIDのセット
  const includedMapIds = useMemo(() => {
    if (!collectionMaps) return new Set<string>();
    return new Set(collectionMaps.map((cm) => cm.map_id));
  }, [collectionMaps]);

  const handleToggleMap = useCallback((mapId: string) => {
    if (!collectionId || !currentUserId || isMutating) return;

    if (includedMapIds.has(mapId)) {
      removeMap({ collectionId, mapId, userId: currentUserId });
    } else {
      addMap({ collectionId, mapId, userId: currentUserId });
    }
  }, [collectionId, currentUserId, includedMapIds, addMap, removeMap, isMutating]);

  const renderMapItem = useCallback(({ item }: { item: MapWithUser }) => {
    const isIncluded = includedMapIds.has(item.id);

    return (
      <View className="px-4 py-4 bg-surface dark:bg-dark-surface border-b border-border-light dark:border-dark-border-light flex-row items-center">
        {/* サムネイル */}
        <MapThumbnail
          url={item.thumbnail_url}
          width={120}
          height={getThumbnailHeight(120)}
          className="mr-3"
        />

        {/* マップ情報 */}
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground dark:text-dark-foreground mb-1" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={12} color={colors.text.secondary} />
              <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{t('addMapsToCollection.spotsCount', { count: item.spots_count })}</Text>
            </View>
            {!item.is_public && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="lock-closed" size={12} color={colors.text.secondary} />
                <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary">{t('publicToggle.privateStatus')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 追加/追加済ボタン */}
        {isIncluded ? (
          <Pressable
            onPress={() => handleToggleMap(item.id)}
            disabled={isMutating}
            className="bg-blue-500 px-4 py-1.5 rounded-full active:bg-blue-600"
          >
            <Text className="text-sm text-white font-medium">{t('bookmark.added')}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => handleToggleMap(item.id)}
            disabled={isMutating}
            className="bg-surface dark:bg-dark-surface border border-foreground dark:border-dark-foreground px-4 py-1.5 rounded-full active:bg-blue-50"
          >
            <Text className="text-sm text-foreground dark:text-dark-foreground font-medium">{t('bookmark.add')}</Text>
          </Pressable>
        )}
      </View>
    );
  }, [includedMapIds, handleToggleMap, isMutating, t]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
        <PageHeader title={t('addMapsToCollection.title')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
        <PageHeader title={t('addMapsToCollection.title')} />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color={colors.gray[400]} />
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">{t('collection.notFound')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-secondary dark:bg-dark-background-secondary">
      <PageHeader title={t('addMapsToCollection.title')} />

      {/* コレクション情報 */}
      <View className="bg-surface dark:bg-dark-surface px-4 py-3 border-b border-border dark:border-dark-border">
        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">{t('addMapsToCollection.addTo')}</Text>
        <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">{collection.name}</Text>
      </View>

      {/* マップ一覧 */}
      {userMaps && userMaps.length > 0 ? (
        <FlatList
          data={userMaps}
          keyExtractor={(item) => item.id}
          renderItem={renderMapItem}
          contentContainerClassName="bg-surface dark:bg-dark-surface"
          ListHeaderComponent={
            <View className="px-4 py-2 bg-background-secondary dark:bg-dark-background-secondary border-b border-border-light dark:border-dark-border-light">
              <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary">
                {t('addMapsToCollection.tapToToggle')}
              </Text>
            </View>
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="map-outline" size={48} color={colors.gray[300]} />
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4 text-center">
            マップがありません{'\n'}先にマップを作成してください
          </Text>
          <Pressable
            onPress={() => router.push('/create-map')}
            className="mt-4 py-2 px-4 bg-primary-500 rounded-lg"
          >
            <Text className="text-white font-medium">マップを作成</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
