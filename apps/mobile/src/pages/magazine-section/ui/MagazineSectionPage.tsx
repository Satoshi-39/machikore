/**
 * マガジンセクションページ
 *
 * セクション内のマップ一覧を表示
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { useMagazineMapsWithSections, useMagazineSections } from '@/entities/featured-contents';
import { useCurrentUserId } from '@/entities/user';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader, RepeatSkeleton, MapListCardSkeleton } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';

interface MagazineSectionPageProps {
  magazineId: string;
  sectionId: string;
}

export function MagazineSectionPage({ magazineId, sectionId }: MagazineSectionPageProps) {
  const { t } = useI18n();
  const router = useRouter();
  const { goBack } = useSafeBack();
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

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

  // ローディング中
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader title={t('magazine.section')} onBack={goBack} useSafeArea={false} />
        <RepeatSkeleton component={MapListCardSkeleton} count={5} />
      </SafeAreaView>
    );
  }

  // エラーまたはセクションが見つからない
  if (error || !section) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader title={t('magazine.section')} onBack={goBack} useSafeArea={false} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-on-surface-variant text-center">
            {t('magazine.sectionNotFound')}
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
          <Ionicons name="map-outline" size={iconSizeNum['4xl']} color={themeColors['on-surface-variant']} />
          <Text className="text-on-surface-variant mt-2">
            {t('magazine.noMaps')}
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
