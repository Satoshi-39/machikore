/**
 * いいねしたスポット一覧Widget
 * データ取得 + 表示を担当（無限スクロール対応）
 * タブがアクティブな時のみレンダリングされることで、無駄なデータ取得を防ぐ
 */

import React, { useCallback, useMemo } from 'react';
import { View, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter, Href } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyState, SwipeableRow } from '@/shared/ui';
import { RepeatSkeleton, SpotListCardSkeleton } from '@/shared/ui/skeleton';
import { SpotListCard } from '@/widgets/spot-cards';
import { useI18n } from '@/shared/lib/i18n';
import { useCurrentTab } from '@/shared/lib';
import { useUserLikedSpots, type LikedSpotItem } from '@/entities/like/api/use-user-likes';
import { useDeleteSpot } from '@/entities/user-spot';
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
  const { mutate: deleteSpot } = useDeleteSpot();

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
    router.push(`/(tabs)/${currentTab}/articles/spots/${spotId}` as Href);
  }, [router, currentTab]);

  // ユーザータップ: プロフィール画面に遷移
  const handleUserPress = useCallback((navUserId: string) => {
    router.push(`/(tabs)/${currentTab}/users/${navUserId}` as Href);
  }, [router, currentTab]);

  // マップアイコンタップ: マップのスポット詳細に遷移
  const handleMapPress = useCallback((spotId: string) => {
    router.push(`/(tabs)/${currentTab}/spots/${spotId}` as Href);
  }, [router, currentTab]);

  // スポット編集
  const handleEdit = useCallback((spotId: string) => {
    router.push(`/edit-spot/${spotId}`);
  }, [router]);

  // スポット削除
  const handleDelete = useCallback((spotId: string) => {
    Alert.alert(
      t('spot.deleteSpot'),
      t('spot.deleteSpotConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => deleteSpot(spotId),
        },
      ]
    );
  }, [t, deleteSpot]);

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
          isOwner={item.spot.user_id === userId}
          onPress={() => handleSpotPress(item.spot.id)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUserPress={handleUserPress}
          onMapPress={() => handleMapPress(item.spot.id)}
        />
      );

      return (
        <SwipeableRow onDelete={() => handleDeleteSpotLike(item.spot.id)}>
          {content}
        </SwipeableRow>
      );
    },
    [userId, handleSpotPress, handleEdit, handleDelete, handleUserPress, handleMapPress, handleDeleteSpotLike]
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
        <ActivityIndicator size="small" className="text-primary" />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return <RepeatSkeleton component={SpotListCardSkeleton} count={4} />;
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
