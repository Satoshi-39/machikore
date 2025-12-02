/**
 * コレクションにマップを追加するページ
 *
 * ユーザーの所有するマップ一覧から選択してコレクションに追加
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { useCollection, useCollectionMaps, useAddMapToCollection, useRemoveMapFromCollection } from '@/entities/collection';
import { useUserMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { PageHeader } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';

export function AddMapsToCollectionPage() {
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
      <View className="px-4 py-4 bg-white border-b border-gray-100 flex-row items-center">
        {/* サムネイル */}
        {item.thumbnail_url ? (
          <Image
            source={{ uri: item.thumbnail_url }}
            className="w-14 h-14 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-14 h-14 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="map" size={20} color={colors.primary.DEFAULT} />
          </View>
        )}

        {/* マップ情報 */}
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 mb-1" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={12} color={colors.text.secondary} />
              <Text className="text-xs text-gray-500">{item.spots_count}スポット</Text>
            </View>
            {!item.is_public && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="lock-closed" size={12} color={colors.text.secondary} />
                <Text className="text-xs text-gray-500">非公開</Text>
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
            <Text className="text-sm text-white font-medium">追加済</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => handleToggleMap(item.id)}
            disabled={isMutating}
            className="bg-white border border-blue-500 px-4 py-1.5 rounded-full active:bg-blue-50"
          >
            <Text className="text-sm text-blue-500 font-medium">追加</Text>
          </Pressable>
        )}
      </View>
    );
  }, [includedMapIds, handleToggleMap, isMutating]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <PageHeader title="マップを追加" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </View>
    );
  }

  if (!collection) {
    return (
      <View className="flex-1 bg-gray-50">
        <PageHeader title="マップを追加" />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color={colors.gray[400]} />
          <Text className="text-gray-500 mt-4">コレクションが見つかりません</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader title="マップを追加" />

      {/* コレクション情報 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-sm text-gray-500">追加先:</Text>
        <Text className="text-base font-semibold text-gray-900">{collection.name}</Text>
      </View>

      {/* マップ一覧 */}
      {userMaps && userMaps.length > 0 ? (
        <FlatList
          data={userMaps}
          keyExtractor={(item) => item.id}
          renderItem={renderMapItem}
          contentContainerClassName="bg-white"
          ListHeaderComponent={
            <View className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <Text className="text-sm text-gray-600">
                タップしてマップを追加/削除
              </Text>
            </View>
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="map-outline" size={48} color={colors.gray[300]} />
          <Text className="text-gray-500 mt-4 text-center">
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
