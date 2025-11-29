/**
 * スポットフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開スポットのフィード表示（Supabaseから取得）
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedSpots, SpotCard } from '@/entities/spot';
import { useUserStore } from '@/entities/user';
import { useSelectedPlaceStore } from '@/features/search-places';
import { AsyncBoundary } from '@/shared/ui';

export function SpotFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const { data: spots, isLoading, error, refetch, isRefetching } = useFeedSpots();
  const setJumpToSpotId = useSelectedPlaceStore((state) => state.setJumpToSpotId);

  // スポットタップ時: そのスポットが所属するマップページに遷移し、該当スポットにフォーカス
  const handleSpotPress = useCallback((mapId: string, spotId: string) => {
    setJumpToSpotId(spotId);
    router.push(`/(tabs)/map?id=${mapId}`);
  }, [router, setJumpToSpotId]);

  // ユーザーアイコンタップ時: ユーザープロフィールページに遷移
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/users/${userId}`);
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
              onPress={() => handleSpotPress(item.map_id, item.id)}
              onUserPress={handleUserPress}
              // Supabase JOINで取得済みのデータを渡す
              embeddedUser={item.user}
              embeddedMasterSpot={item.master_spot}
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
