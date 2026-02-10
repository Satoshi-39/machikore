/**
 * 最近見たマップ一覧ページ
 *
 * 閲覧履歴をリスト形式で表示（50件）
 */

import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useRecentViewHistory } from '@/entities/view-history';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader, AsyncBoundary, RepeatSkeleton, MapListCardSkeleton } from '@/shared/ui';
import type { MapWithUser } from '@/shared/types';
import { useSafeBack, useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';

export function ViewHistoryPage() {
  const { t } = useI18n();
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

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  // 未ログインの場合
  if (!currentUserId) {
    return (
      <SafeAreaView
        className="flex-1 bg-surface"
        edges={['top']}
      >
        <PageHeader title={t('viewHistory.title')} onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-on-surface-variant">
            {t('viewHistory.loginRequired')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface"
      edges={['top']}
    >
      <PageHeader title={t('viewHistory.title')} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={viewHistory && viewHistory.length > 0 ? viewHistory : null}
        loadingComponent={<RepeatSkeleton component={MapListCardSkeleton} count={5} />}
        emptyMessage={t('viewHistory.empty')}
        emptyIonIcon="time-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MapListCard
                map={item.map as MapWithUser}
                currentUserId={currentUserId}
                isOwner={item.map.user_id === currentUserId}
                onPress={() => handleArticlePress(item.map.id)}
                onUserPress={handleUserPress}
                onMapPress={handleMapPress}
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
