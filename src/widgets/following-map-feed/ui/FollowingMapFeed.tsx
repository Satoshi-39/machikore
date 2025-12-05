/**
 * フォロー中マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - フォロー中ユーザーのマップフィード表示
 * - 無限スクロール対応
 * - 未ログイン時はログイン促進メッセージを表示
 */

import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary } from '@/shared/ui';
import { colors } from '@/shared/config';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getFollowingUsersMaps } from '@/shared/api/supabase';
import type { MapWithUser } from '@/shared/types';

const PAGE_SIZE = 10;

export function FollowingMapFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const userId = currentUser?.id;

  // フォロー中ユーザーのマップ取得
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MapWithUser[], Error>({
    queryKey: [...QUERY_KEYS.maps, 'feed', 'following', userId],
    queryFn: ({ pageParam = 0 }) => {
      if (!userId) return Promise.resolve([]);
      return getFollowingUsersMaps(userId, PAGE_SIZE, pageParam as number);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length * PAGE_SIZE;
    },
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    enabled: !!userId, // ログイン時のみ有効
  });

  // ページデータをフラット化
  const maps = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/maps/${mapId}`);
  }, [router]);

  const handleUserPress = useCallback((userId: string) => {
    router.push(`/(tabs)/discover/users/${userId}`);
  }, [router]);

  const handleEditMap = useCallback((mapId: string) => {
    router.push(`/edit-map/${mapId}`);
  }, [router]);

  const handleCommentPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/comments/maps/${mapId}`);
  }, [router]);

  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/articles/maps/${mapId}`);
  }, [router]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }, [isFetchingNextPage]);

  // 未ログイン時の表示
  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-center">
          ログインするとフォロー中のユーザーのマップが表示されます
        </Text>
      </View>
    );
  }

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={maps.length > 0 ? maps : null}
      emptyMessage="フォロー中のユーザーのマップはありません"
      emptyIonIcon="people-outline"
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
