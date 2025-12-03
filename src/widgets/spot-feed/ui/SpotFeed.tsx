/**
 * スポットフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開スポットのフィード表示（Supabaseから取得）
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useFeedSpots, SpotCard } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary } from '@/shared/ui';

export function SpotFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  // currentUserId を渡していいね状態も含めて取得
  const { data: spots, isLoading, error, refetch, isRefetching } = useFeedSpots(currentUser?.id);

  // スポットタップ時: スポット詳細ページに遷移（発見タブ内スタック）
  const handleSpotPress = useCallback((_mapId: string, spotId: string) => {
    router.push(`/(tabs)/discover/spots/${spotId}`);
  }, [router]);

  // ユーザーアイコンタップ時: ユーザープロフィールページに遷移（発見タブ内スタック）
  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/discover/users/${userId}`);
  }, [router]);

  // スポット編集
  const handleEditSpot = useCallback((spotId: string) => {
    router.push(`/edit-spot/${spotId}` as Href);
  }, [router]);

  // コメント詳細ページへ遷移（発見タブ内スタック）
  const handleCommentPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/discover/comments/spots/${spotId}`);
  }, [router]);

  // マップ詳細ページへ遷移（発見タブ内スタック）
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/maps/${mapId}`);
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
              currentUserId={currentUser?.id}
              onPress={() => handleSpotPress(item.map_id, item.id)}
              onUserPress={handleUserPress}
              onMapPress={handleMapPress}
              onEdit={handleEditSpot}
              onCommentPress={handleCommentPress}
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
