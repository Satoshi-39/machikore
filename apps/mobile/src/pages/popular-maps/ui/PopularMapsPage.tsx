/**
 * 人気マップランキング一覧ページ
 *
 * 人気マップをリスト形式で表示（30件）
 * ランキングバッジ付き
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { usePopularMaps } from '@/entities/map';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader, AsyncBoundary } from '@/shared/ui';
import { useSafeBack, useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';

export function PopularMapsPage() {
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
  } = usePopularMaps(30, currentUserId);

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

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-dark-surface"
      edges={['top']}
    >
      <PageHeader title={t('section.popularRanking')} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={maps && maps.length > 0 ? maps : null}
        emptyMessage={t('section.noPopularMaps')}
        emptyIonIcon="trending-up-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MapListCard
                map={item}
                currentUserId={currentUserId}
                isOwner={item.user_id === currentUserId}
                rank={index + 1}
                onPress={() => handleArticlePress(item.id)}
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
