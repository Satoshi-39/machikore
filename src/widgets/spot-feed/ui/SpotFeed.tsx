/**
 * スポットフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開スポットのフィード表示
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedSpots, SpotCard } from '@/entities/spot';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary } from '@/shared/ui';

export function SpotFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const { data: spots, isLoading, error, refetch, isRefetching } = useFeedSpots();

  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/spots/${spotId}`);
  }, [router]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={spots}
      emptyMessage="スポットがまだありません"
      emptyIonIcon="location-outline"
    >
      {(data) => (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpotCard
              spot={item}
              userId={currentUser?.id ?? ''}
              onPress={() => handleSpotPress(item.id)}
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
