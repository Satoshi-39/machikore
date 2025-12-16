/**
 * 最近見たマップ一覧ページ
 *
 * 閲覧履歴をリスト形式で表示（50件）
 */

import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useRecentViewHistory, type ViewHistoryWithMap } from '@/entities/view-history';
import { PageHeader, AsyncBoundary, MapThumbnail } from '@/shared/ui';
import { useSafeBack, useCurrentTab, formatRelativeTime } from '@/shared/lib';

// コンパクトなマップカード
interface CompactMapCardProps {
  item: ViewHistoryWithMap;
  onPress: () => void;
}

function CompactMapCard({ item, onPress }: CompactMapCardProps) {
  const { map } = item;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-surface dark:bg-dark-surface border-b border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-900"
    >
      {/* サムネイル（小さめ） */}
      <MapThumbnail
        url={map.thumbnail_url}
        width={64}
        height={64}
        borderRadius={8}
        defaultImagePadding={0.15}
      />

      {/* マップ情報 */}
      <View className="flex-1 ml-3">
        <Text
          className="text-base font-semibold text-text dark:text-dark-text"
          numberOfLines={1}
        >
          {map.name}
        </Text>

        {/* ユーザー名 */}
        {map.user && (
          <Text
            className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5"
            numberOfLines={1}
          >
            @{map.user.username}
          </Text>
        )}

        {/* スポット数・いいね数・閲覧日時 */}
        <View className="flex-row items-center mt-1 gap-3">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-text-secondary dark:text-dark-text-secondary ml-1">
              {map.spots_count}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-text-secondary dark:text-dark-text-secondary ml-1">
              {map.likes_count}
            </Text>
          </View>
          <Text className="text-xs text-text-secondary dark:text-dark-text-secondary">
            {formatRelativeTime(item.viewed_at)}
          </Text>
        </View>
      </View>

      {/* 矢印 */}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

export function ViewHistoryPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  const {
    data: viewHistory,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useRecentViewHistory(currentUserId, 50);

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  // 未ログインの場合
  if (!currentUserId) {
    return (
      <SafeAreaView
        className="flex-1 bg-surface dark:bg-dark-surface"
        edges={['top']}
      >
        <PageHeader title="最近見たマップ" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary dark:text-dark-text-secondary">
            ログインすると閲覧履歴が表示されます
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-dark-surface"
      edges={['top']}
    >
      <PageHeader title="最近見たマップ" onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={viewHistory && viewHistory.length > 0 ? viewHistory : null}
        emptyMessage="まだ閲覧履歴がありません"
        emptyIonIcon="time-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CompactMapCard
                item={item}
                onPress={() => handleMapPress(item.map.id)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </AsyncBoundary>
    </SafeAreaView>
  );
}
