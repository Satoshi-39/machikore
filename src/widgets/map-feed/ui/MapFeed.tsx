/**
 * マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開マップのフィード表示
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedMaps, MapCard } from '@/entities/user-map';
import { AsyncBoundary } from '@/shared/ui';

export function MapFeed() {
  const router = useRouter();
  const { data: maps, isLoading, error, refetch, isRefetching } = useFeedMaps();

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/maps/${mapId}`);
  }, [router]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={maps}
      emptyMessage="マップがまだありません"
      emptyIonIcon="map-outline"
    >
      {(data) => (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MapCard map={item} onPress={() => handleMapPress(item.id)} />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </AsyncBoundary>
  );
}
