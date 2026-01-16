/**
 * タグ検索結果ページ
 *
 * 特定のタグが付いたマップをコンパクトなリスト形式で表示
 */

import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useMapTagSearch } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader, AsyncBoundary } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';

export function TagResultsPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const currentUserId = useCurrentUserId();

  const { data: maps, isLoading, error, refetch, isRefetching } = useMapTagSearch(tag || '');

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  if (!tag) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
        <PageHeader title="タグ検索" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary">
            タグが指定されていません
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      <PageHeader title={`#${tag}`} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={maps && maps.length > 0 ? maps : null}
        emptyMessage={`「${tag}」タグのマップが見つかりませんでした`}
        emptyIonIcon="map-outline"
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MapListCard
                map={item}
                currentUserId={currentUserId}
                onPress={() => handleMapPress(item.id)}
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
