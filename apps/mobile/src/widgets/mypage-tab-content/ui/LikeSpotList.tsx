/**
 * いいねしたスポット一覧Widget
 * データ取得 + 表示を担当（無限スクロール対応）
 * タブがアクティブな時のみレンダリングされることで、無駄なデータ取得を防ぐ
 */

import React, { useCallback, useMemo } from 'react';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Loading, EmptyState, SwipeableRow } from '@/shared/ui';
import { SpotListCard } from '@/widgets/spot-cards';
import { useI18n } from '@/shared/lib/i18n';
import { colors } from '@/shared/config';
import { useCurrentTab } from '@/shared/lib';
import { useUserLikedSpots, type LikedSpotItem } from '@/entities/like/api/use-user-likes';
import { removeSpotLike } from '@/shared/api/supabase/likes';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { log } from '@/shared/config/logger';

export type { LikedSpotItem };

interface LikeSpotListProps {
  userId: string;
}

export function LikeSpotList({ userId }: LikeSpotListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const currentTab = useCurrentTab();
  const queryClient = useQueryClient();

  // データ取得
  const {
    data: spotsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useUserLikedSpots(userId);

  // ページデータをフラット化
  const data = useMemo(
    () => spotsData?.pages.flatMap((page) => page) ?? [],
    [spotsData]
  );

  // スポットタップ: スポット詳細画面に遷移
  const handleSpotPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${currentTab}/spots/${spotId}` as any);
  }, [router, currentTab]);

  // ユーザータップ: プロフィール画面に遷移
  const handleUserPress = useCallback((navUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${navUserId}` as any);
  }, [router, currentTab]);

  // スポットいいね削除
  const handleDeleteSpotLike = useCallback(async (spotId: string) => {
    try {
      await removeSpotLike(userId, spotId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userLikedSpots(userId) });
    } catch (error) {
      log.error('[LikeSpotList] Failed to delete spot like:', error);
    }
  }, [userId, queryClient]);

  const renderItem = useCallback(
    ({ item }: { item: LikedSpotItem }) => {
      const content = (
        <SpotListCard
          spot={item.spot}
          currentUserId={userId}
          onPress={() => handleSpotPress(item.spot.id)}
          onUserPress={handleUserPress}
        />
      );

      return (
        <SwipeableRow onDelete={() => handleDeleteSpotLike(item.spot.id)}>
          {content}
        </SwipeableRow>
      );
    },
    [userId, handleSpotPress, handleUserPress, handleDeleteSpotLike]
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
        message={t('favorite.noLikedSpots')}
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
