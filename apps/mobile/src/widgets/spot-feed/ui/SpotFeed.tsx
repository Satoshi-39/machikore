/**
 * スポットフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開スポットのフィード表示（Supabaseから取得）
 * - 無限スクロール対応
 */

import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useFeedSpots, SpotCard } from '@/entities/user-spot';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary } from '@/shared/ui';
import { colors } from '@/shared/config';
import { CommentModal } from '@/widgets/comment-modal';

export function SpotFeed() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  // コメントモーダル用の状態
  const [commentModalSpotId, setCommentModalSpotId] = useState<string | null>(null);

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
  } = useFeedSpots(currentUser?.id);

  // ページデータをフラット化
  const spots = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

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

  // コメントモーダルを開く
  const handleCommentPress = useCallback((spotId: string) => {
    setCommentModalSpotId(spotId);
  }, []);

  // マップ詳細ページへ遷移（発見タブ内スタック）
  const handleMapPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/maps/${mapId}`);
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
      data={spots.length > 0 ? spots : null}
      emptyMessage="スポットがまだありません"
      emptyIonIcon="location-outline"
    >
      {(data) => (
        <>
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
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />

          {/* コメントモーダル */}
          <CommentModal
            visible={!!commentModalSpotId}
            onClose={() => setCommentModalSpotId(null)}
            type="spot"
            targetId={commentModalSpotId ?? ''}
            currentUserId={currentUser?.id}
            onUserPress={handleUserPress}
          />
        </>
      )}
    </AsyncBoundary>
  );
}
