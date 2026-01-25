/**
 * マガジンセクションページ
 *
 * セクション内のマップ一覧を表示
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMagazineMapsWithSections, useMagazineSections } from '@/entities/featured-contents';
import { useCurrentUserId } from '@/entities/user';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';
import { colors } from '@/shared/config';

interface MagazineSectionPageProps {
  magazineId: string;
  sectionId: string;
}

export function MagazineSectionPage({ magazineId, sectionId }: MagazineSectionPageProps) {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const currentUserId = useCurrentUserId();

  // セクション情報を取得
  const sectionsQuery = useMagazineSections(magazineId);
  const section = sectionsQuery.data?.find((s) => s.id === sectionId);

  // マップ一覧を取得
  const mapsQuery = useMagazineMapsWithSections(magazineId, currentUserId);

  // このセクションのマップのみフィルタリング
  const sectionMaps = mapsQuery.data?.filter((m) => m.section_id === sectionId) ?? [];

  const isLoading = sectionsQuery.isLoading || mapsQuery.isLoading;
  const error = sectionsQuery.error || mapsQuery.error;
  const isRefetching = sectionsQuery.isRefetching || mapsQuery.isRefetching;

  const refetch = useCallback(async () => {
    await Promise.all([sectionsQuery.refetch(), mapsQuery.refetch()]);
  }, [sectionsQuery, mapsQuery]);

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/articles/maps/${mapId}` as Href);
    },
    [router]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  // ローディング中
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader title="セクション" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  // エラーまたはセクションが見つからない
  if (error || !section) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader title="セクション" onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-on-surface-variant text-center">
            セクションが見つかりませんでした
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ヘッダーコンテンツ（タイトル + 説明）
  const headerContent = (
    <View className="px-4 py-4">
      {section.title && (
        <Text className="text-xl font-bold text-on-surface mb-2">
          {section.title}
        </Text>
      )}
      {section.description && (
        <Text className="text-base text-on-surface">
          {section.description}
        </Text>
      )}
    </View>
  );

  // マップがない場合
  if (sectionMaps.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader title={section.name} onBack={goBack} useSafeArea={false} />
        {headerContent}
        <View className="flex-1 items-center justify-center py-8">
          <Ionicons name="map-outline" size={48} color="#9CA3AF" />
          <Text className="text-on-surface-variant mt-2">
            マップがありません
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <PageHeader title={section.name} onBack={goBack} useSafeArea={false} />

      <FlatList
        data={sectionMaps}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={headerContent}
        renderItem={({ item }) => (
          <MapListCard
            map={item}
            currentUserId={currentUserId}
            onPress={() => handleArticlePress(item.id)}
            onMapPress={handleMapPress}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
