/**
 * マップフィードWidget
 *
 * FSDの原則：Widget層 - 複数のFeature/Entityを組み合わせた複合コンポーネント
 * - 公開マップのフィード表示
 * - 無限スクロール対応
 * - 広告表示（5件ごと）
 */

import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedMaps, MapCard } from '@/entities/map';
import { useUserStore } from '@/entities/user';
import { AsyncBoundary, NativeAdCard } from '@/shared/ui';
import { colors } from '@/shared/config';
import type { MapWithUser } from '@/shared/types';

/** 広告を挿入する間隔（マップ5件ごとに1広告） */
const AD_INTERVAL = 5;

type FeedItem =
  | { type: 'map'; data: MapWithUser }
  | { type: 'ad'; id: string };

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

  // ページデータをフラット化し、広告を挿入
  const feedItems = useMemo((): FeedItem[] => {
    const maps = data?.pages.flatMap((page) => page) ?? [];
    const items: FeedItem[] = [];

    maps.forEach((map, index) => {
      items.push({ type: 'map', data: map });

      // AD_INTERVAL件ごとに広告を挿入（最後のアイテムの後には挿入しない）
      if ((index + 1) % AD_INTERVAL === 0 && index < maps.length - 1) {
        items.push({ type: 'ad', id: `ad-${index}` });
      }
    });

    return items;
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

  // コメントモーダルを開く
  const handleCommentPress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/comment-modal/maps/${mapId}`);
  }, [router]);

  // 記事ページへ遷移
  const handleArticlePress = useCallback((mapId: string) => {
    router.push(`/(tabs)/discover/articles/maps/${mapId}`);
  }, [router]);

  // タグタップで検索画面に遷移
  const handleTagPress = useCallback((tagName: string) => {
    router.push(`/(tabs)/discover/search?tag=${encodeURIComponent(tagName)}`);
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

  // フィードアイテムのレンダリング
  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => {
      if (item.type === 'ad') {
        return <NativeAdCard />;
      }

      return (
        <MapCard
          map={item.data}
          currentUserId={currentUser?.id}
          onPress={() => handleMapPress(item.data.id)}
          onUserPress={handleUserPress}
          onEdit={handleEditMap}
          onCommentPress={handleCommentPress}
          onArticlePress={handleArticlePress}
          onTagPress={handleTagPress}
        />
      );
    },
    [currentUser?.id, handleMapPress, handleUserPress, handleEditMap, handleCommentPress, handleArticlePress, handleTagPress]
  );

  const getItemKey = useCallback((item: FeedItem) => {
    return item.type === 'ad' ? item.id : item.data.id;
  }, []);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      data={feedItems.length > 0 ? feedItems : null}
      emptyMessage="マップがまだありません"
      emptyIonIcon="map-outline"
    >
      {(items) => (
        <>
          <FlatList
            data={items}
            keyExtractor={getItemKey}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </AsyncBoundary>
  );
}
