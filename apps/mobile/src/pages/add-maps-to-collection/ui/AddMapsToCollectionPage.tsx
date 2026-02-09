/**
 * コレクションにマップを追加するページ
 *
 * ユーザーの所有するマップ一覧から選択してコレクションに追加
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCollection, useCollectionMaps, useAddMapToCollection, useRemoveMapFromCollection } from '@/entities/collection';
import { useUserMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { getThumbnailHeight, iconSizeNum, colors } from '@/shared/config';
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
  const { data: userMaps, isLoading: isLoadingUserMaps } = useUserMaps(currentUserId, { currentUserId });
  const { mutate: addMap } = useAddMapToCollection();
  const { mutate: removeMap } = useRemoveMapFromCollection();

  const isLoading = isLoadingCollection || isLoadingCollectionMaps || isLoadingUserMaps;

  // コレクションに含まれているマップIDのセット
  const includedMapIds = useMemo(() => {
    if (!collectionMaps?.pages) return new Set<string>();
    const allMaps = collectionMaps.pages.flatMap((page) => page);
    return new Set(allMaps.map((cm) => cm.map_id));
  }, [collectionMaps]);

  const handleToggleMap = useCallback((mapId: string) => {
    if (!collectionId || !currentUserId) return;

    if (includedMapIds.has(mapId)) {
      removeMap({ collectionId, mapId, userId: currentUserId });
    } else {
      addMap({ collectionId, mapId, userId: currentUserId });
    }
  }, [collectionId, currentUserId, includedMapIds, addMap, removeMap]);

  const renderMapItem = useCallback(({ item }: { item: MapWithUser }) => {
    const isIncluded = includedMapIds.has(item.id);

    return (
      <View className="px-4 py-4 bg-surface border-b-thin border-outline-variant flex-row items-center">
        {/* サムネイル */}
        <MapThumbnail
          url={item.thumbnail_url}
          crop={item.thumbnail_crop}
          width={120}
          height={getThumbnailHeight(120)}
          className="mr-3"
        />

        {/* マップ情報 */}
        <View className="flex-1">
          <Text className="text-base font-medium text-on-surface mb-1" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={iconSizeNum.xs} className="text-on-surface-variant" />
              <Text className="text-xs text-on-surface-variant">{t('addMapsToCollection.spotsCount', { count: item.spots_count })}</Text>
            </View>
            {!item.is_public && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="lock-closed" size={iconSizeNum.xs} className="text-on-surface-variant" />
                <Text className="text-xs text-on-surface-variant">{t('publicToggle.privateStatus')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 追加/追加済ボタン */}
        <TouchableOpacity
          onPress={() => handleToggleMap(item.id)}
          className="px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: isIncluded ? colors.primitive.gray[200] : colors.light.primary,
            borderWidth: isIncluded ? 1 : 0,
            borderColor: isIncluded ? colors.primitive.gray[300] : undefined,
          }}
        >
          <Text
            className={`text-sm font-medium ${
              isIncluded ? 'text-on-surface-variant' : 'text-white'
            }`}
          >
            {isIncluded ? t('bookmark.added') : t('bookmark.add')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [includedMapIds, handleToggleMap, t]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('addMapsToCollection.title')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('addMapsToCollection.title')} />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={iconSizeNum['4xl']} className="text-gray-400" />
          <Text className="text-on-surface-variant mt-4">{t('collection.notFound')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('addMapsToCollection.title')} />

      {/* コレクション情報 */}
      <View className="bg-surface px-4 py-3 border-b-thin border-outline">
        <Text className="text-sm text-on-surface-variant">{t('addMapsToCollection.addTo')}</Text>
        <Text className="text-base font-semibold text-on-surface">{collection.name}</Text>
      </View>

      {/* マップ一覧 */}
      {userMaps && userMaps.length > 0 ? (
        <FlatList
          data={userMaps}
          keyExtractor={(item) => item.id}
          renderItem={renderMapItem}
          contentContainerClassName="bg-surface"
        />
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="map-outline" size={iconSizeNum['4xl']} className="text-gray-300" />
          <Text className="text-on-surface-variant mt-4 text-center">
            {t('addMapsToCollection.noMaps')}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/create-map')}
            className="mt-4 py-2 px-4 rounded-lg"
            style={{ backgroundColor: colors.light.primary }}
          >
            <Text className="text-white font-medium">{t('addMapsToCollection.createMap')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
