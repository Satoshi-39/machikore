/**
 * コレクション詳細ページ
 *
 * コレクション内のマップ一覧を表示
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import {
  useCollection,
  useCollectionMaps,
} from '@/entities/collection';
import { useCurrentUserId } from '@/entities/user';
import { PageHeader, Loading, ErrorView } from '@/shared/ui';
import type { CollectionMapWithDetails } from '@/shared/api/supabase/collections';

interface CollectionDetailPageProps {
  collectionId: string;
}

function MapItem({
  item,
  onPress,
}: {
  item: CollectionMapWithDetails;
  onPress: () => void;
}) {
  const map = item.map;
  if (!map) return null;

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-4 bg-white border-b border-gray-100"
    >
      <View className="flex-row items-start">
        {/* サムネイル */}
        {map.thumbnail_url ? (
          <Image
            source={{ uri: map.thumbnail_url }}
            className="w-16 h-16 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="map" size={24} color={colors.primary.DEFAULT} />
          </View>
        )}

        {/* マップ情報 */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {map.name}
          </Text>
          {map.description && (
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
              {map.description}
            </Text>
          )}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-gray-500">
                {map.spots_count}スポット
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="heart" size={14} color={colors.text.secondary} />
              <Text className="text-xs text-gray-500">
                {map.likes_count}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function CollectionDetailPage({ collectionId }: CollectionDetailPageProps) {
  const router = useRouter();
  const segments = useSegments();
  const currentUserId = useCurrentUserId();

  const { data: collection, isLoading: isLoadingCollection, error: collectionError } = useCollection(collectionId);
  const { data: collectionMaps, isLoading: isLoadingMaps, error: mapsError } = useCollectionMaps(collectionId);

  const isOwner = collection?.user_id === currentUserId;
  const isLoading = isLoadingCollection || isLoadingMaps;
  const error = collectionError || mapsError;

  // タブ判定
  const isInDiscoverTab = segments[0] === '(tabs)' && segments[1] === 'discover';
  const isInMapTab = segments[0] === '(tabs)' && segments[1] === 'map';
  const isInMypageTab = segments[0] === '(tabs)' && segments[1] === 'mypage';
  const isInNotificationsTab = segments[0] === '(tabs)' && segments[1] === 'notifications';

  const handleMapPress = useCallback((mapId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/maps/${mapId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/${mapId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/maps/${mapId}`);
    } else {
      router.push(`/(tabs)/mypage/maps/${mapId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

  const handleUserPress = useCallback((userId: string) => {
    if (isInDiscoverTab) {
      router.push(`/(tabs)/discover/users/${userId}`);
    } else if (isInMapTab) {
      router.push(`/(tabs)/map/users/${userId}`);
    } else if (isInMypageTab) {
      router.push(`/(tabs)/mypage/users/${userId}`);
    } else if (isInNotificationsTab) {
      router.push(`/(tabs)/notifications/users/${userId}`);
    } else {
      router.push(`/(tabs)/mypage/users/${userId}`);
    }
  }, [router, isInDiscoverTab, isInMapTab, isInMypageTab, isInNotificationsTab]);

  const renderHeader = useCallback(() => {
    if (!collection) return null;
    return (
      <View className="bg-white border-b border-gray-100">
        {/* コレクション情報 */}
        <View className="px-4 py-4">
          <View className="flex-row items-start">
            {/* サムネイル */}
            {collection.thumbnail_url ? (
              <Image
                source={{ uri: collection.thumbnail_url }}
                className="w-20 h-20 rounded-xl mr-4"
                resizeMode="cover"
              />
            ) : (
              <View
                className="w-20 h-20 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: collection.color || colors.gray[100] }}
              >
                <Ionicons
                  name="library"
                  size={32}
                  color={collection.color ? '#fff' : colors.primary.DEFAULT}
                />
              </View>
            )}

            {/* テキスト情報 */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {collection.name}
              </Text>
              {collection.description && (
                <Text className="text-sm text-gray-600 mb-2" numberOfLines={3}>
                  {collection.description}
                </Text>
              )}
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="map" size={14} color={colors.text.secondary} />
                  <Text className="text-xs text-gray-500">
                    {collection.maps_count}マップ
                  </Text>
                </View>
                {!collection.is_public && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="lock-closed" size={14} color={colors.text.secondary} />
                    <Text className="text-xs text-gray-500">非公開</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 作成者情報 */}
          {collection.user && (
            <Pressable
              onPress={() => handleUserPress(collection.user_id)}
              className="flex-row items-center mt-4 pt-4 border-t border-gray-100"
            >
              {collection.user.avatar_url ? (
                <Image
                  source={{ uri: collection.user.avatar_url }}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
                  <Ionicons name="person" size={16} color={colors.gray[400]} />
                </View>
              )}
              <Text className="text-sm text-gray-700">
                {collection.user.display_name || collection.user.username || '名無しさん'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* セクションヘッダー */}
        <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <Text className="text-sm font-semibold text-gray-600">
            マップ一覧
          </Text>
        </View>
      </View>
    );
  }, [collection, isOwner, collectionId, router, handleUserPress]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <PageHeader title="コレクション" />
        <Loading message="読み込み中..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50">
        <PageHeader title="コレクション" />
        <ErrorView error={error} />
      </View>
    );
  }

  const handleAddMaps = useCallback(() => {
    router.push(`/add-maps-to-collection?id=${collectionId}` as any);
  }, [router, collectionId]);

  return (
    <View className="flex-1 bg-gray-50">
      <PageHeader
        title="コレクション"
        rightComponent={
          isOwner ? (
            <Pressable onPress={handleAddMaps} className="py-2">
              <Text className="text-base font-semibold text-primary-600">編集</Text>
            </Pressable>
          ) : undefined
        }
      />

      <FlatList
        data={collectionMaps || []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <MapItem
            item={item}
            onPress={() => item.map && handleMapPress(item.map.id)}
          />
        )}
        contentContainerClassName="bg-white flex-grow"
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Ionicons name="map-outline" size={48} color={colors.gray[300]} />
            <Text className="text-gray-400 mt-4">まだマップがありません</Text>
          </View>
        }
      />
    </View>
  );
}
