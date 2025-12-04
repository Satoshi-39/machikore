/**
 * マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開マップのフィード表示
 * - 無限スクロール対応
 */

import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedMaps, MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary } from '@/shared/ui';
import { colors } from '@/shared/config';

export function MapFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  // 無限スクロール対応のフック
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedMaps();

  // ページデータをフラット化
  const maps = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

  const handleMapPress = useCallback((mapId: string) => {
    // 発見タブ内スタックに遷移（タブバーを維持）
    router.push(`/(tabs)/discover/maps/${mapId}`);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    // 発見タブ内スタックに遷移（タブバーを維持）
    router.push(`/(tabs)/discover/users/${userId}`);
  }, [router]);

  const handleEditMap = useCallback((mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  }, [router]);

  // コメント詳細ページへ遷移（発見タブ内スタック）
  const handleCommentPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/comments/maps/${mapId}`);
  }, [router]);

  // 記事ページへ遷移
  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/articles/maps/${mapId}`);
  }, [router]);

  // 下端に近づいたら次のページを取得
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ローディングフッター
  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }, [isFetchingNextPage]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={maps.length > 0 ? maps : null}
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
              onCommentPress={handleCommentPress}
              onArticlePress={handleArticlePress}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </AsyncBoundary>
  );
}
