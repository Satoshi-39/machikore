/**
 * マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開マップのフィード表示
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedMaps, MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary } from '@/shared/ui';

export function MapFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const { data: maps, isLoading, error, refetch, isRefetching } = useFeedMaps();

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/map?id=${mapId}`);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/users/${userId}`);
  }, [router]);

  const handleEditMap = useCallback((mapId: string) => {
    router.push(`/edit-map?id=${mapId}`);
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
            <MapCard
              map={item}
              currentUserId={currentUser?.id}
              onPress={() => handleMapPress(item.id)}
              onUserPress={handleUserPress}
              onEdit={handleEditMap}
            />
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
