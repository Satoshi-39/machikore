/**
 * タグ検索結果ページ
 *
 * 特定のタグが付いたマップをコンパクトなリスト形式で表示
 */

import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useMapTagSearch } from '@/entities/map';
import { PageHeader, AsyncBoundary, MapThumbnail } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';
import type { MapWithUser } from '@/shared/types';

// コンパクトなマップカード
interface CompactMapCardProps {
  map: MapWithUser;
  onPress: () => void;
}

function CompactMapCard({ map, onPress }: CompactMapCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-surface dark:bg-dark-surface border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-900"
    >
      {/* サムネイル（小さめ） */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={64}
        height={64}
        borderRadius={8}
        defaultImagePadding={0.15}
      />

      {/* マップ情報 */}
      <View className="flex-1 ml-3">
        <Text
          className="text-base font-semibold text-text dark:text-dark-text"
          numberOfLines={1}
        >
          {map.name}
        </Text>

        {/* ユーザー名 */}
        {map.user && (
          <Text
            className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5"
            numberOfLines={1}
          >
            @{map.user.username}
          </Text>
        )}

        {/* スポット数・いいね数 */}
        <View className="flex-row items-center mt-1 gap-3">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-text-secondary dark:text-dark-text-secondary ml-1">
              {map.spots_count}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-text-secondary dark:text-dark-text-secondary ml-1">
              {map.likes_count}
            </Text>
          </View>
        </View>
      </View>

      {/* 矢印 */}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

export function TagResultsPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const { tag } = useLocalSearchParams<{ tag: string }>();

  const { data: maps, isLoading, error, refetch, isRefetching } = useMapTagSearch(tag || '');

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  if (!tag) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="タグ検索" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary dark:text-dark-text-secondary">
            タグが指定されていません
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      <PageHeader title={`#${tag}`} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={maps && maps.length > 0 ? maps : null}
        emptyMessage={`「${tag}」タグのマップが見つかりませんでした`}
        emptyIonIcon="map-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CompactMapCard
                map={item}
                onPress={() => handleMapPress(item.id)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </AsyncBoundary>
    </SafeAreaView>
  );
}
