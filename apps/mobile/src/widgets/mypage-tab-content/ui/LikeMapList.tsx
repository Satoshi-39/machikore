/**
 * いいねしたマップ一覧Widget
 * データ取得 + 表示を担当（無限スクロール対応）
 * タブがアクティブな時のみレンダリングされることで、無駄なデータ取得を防ぐ
 */

import React, { useCallback, useMemo } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Loading, EmptyState, SwipeableRow } from '@/shared/ui';
import { MapListCard } from '@/widgets/map-cards';
import { useI18n } from '@/shared/lib/i18n';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { useUserLikedMaps, type LikedMapItem } from '@/entities/like/api/use-user-likes';
import { removeMapLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';
import type { MapWithUser } from '@/shared/types';

export type { LikedMapItem };

interface LikeMapListProps {
  userId: string;
}

export function LikeMapList({ userId }: LikeMapListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const queryClient = useQueryClient();

  // データ取得
  const {
    data: mapsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useUserLikedMaps(userId);

  // ページデータをフラット化
  const data = useMemo(
    () => mapsData?.pages.flatMap((page) => page) ?? [],
    [mapsData]
  );

  // マップタップ: マップ詳細画面に遷移
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/maps/${mapId}` as any);
  }, [router, currentTab]);

  // ユーザータップ: プロフィール画面に遷移
  const handleUserPress = useCallback((navUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${navUserId}` as any);
  }, [router, currentTab]);

  // 記事タップ: 記事画面に遷移
  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as any);
  }, [router, currentTab]);

  // マップいいね削除
  const handleDeleteMapLike = useCallback(async (mapId: string) => {
    try {
      await removeMapLike(userId, mapId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedMaps(userId) });
    } catch (error) {
      log.error('[LikeMapList] Failed to delete map like:', error);
    }
  }, [userId, queryClient]);

  const renderItem = useCallback(
    ({ item }: { item: LikedMapItem }) => {
      const content = (
        <MapListCard
          map={item.map as MapWithUser}
          currentUserId={userId}
          isOwner={item.map.user?.id === userId}
          onPress={() => handleMapPress(item.map.id)}
          onUserPress={handleUserPress}
          onArticlePress={handleArticlePress}
        />
      );

      return (
        <SwipeableRow onDelete={() => handleDeleteMapLike(item.map.id)}>
          {content}
        </SwipeableRow>
      );
    },
    [userId, handleMapPress, handleUserPress, handleArticlePress, handleDeleteMapLike]
  );

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

  if (isLoading) {
    return <Loading variant="inline" />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        ionIcon="heart-outline"
        message={t('favorite.noLikedMaps')}
      />
    );
  }

  return (
    <FlashList
      data={data}
      keyExtractor={(item) => item.likeId}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 16 }}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
