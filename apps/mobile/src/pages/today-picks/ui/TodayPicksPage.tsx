/**
 * 本日のピックアップ一覧ページ
 *
 * 本日のピックアップをリスト形式で表示（30件）
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useTodayPicksMaps } from '@/entities/map';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader, AsyncBoundary, RepeatSkeleton, MapListCardSkeleton } from '@/shared/ui';
import { useSafeBack, useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';

export function TodayPicksPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { goBack } = useSafeBack();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();

  const {
    data: maps,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useTodayPicksMaps(30, currentUserId);

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  return (
    <SafeAreaView
      className="flex-1 bg-surface"
      edges={['top']}
    >
      <PageHeader title={t('section.todaysPicks')} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={maps && maps.length > 0 ? maps : null}
        loadingComponent={<RepeatSkeleton component={MapListCardSkeleton} count={5} />}
        emptyMessage={t('section.noTodayPicks')}
        emptyIonIcon="sparkles-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MapListCard
                map={item}
                currentUserId={currentUserId}
                isOwner={item.user_id === currentUserId}
                onPress={() => handleArticlePress(item.id)}
                onUserPress={handleUserPress}
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
