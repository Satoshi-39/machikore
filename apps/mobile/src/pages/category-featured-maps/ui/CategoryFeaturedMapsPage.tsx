/**
 * カテゴリ別おすすめマップ一覧ページ
 *
 * 運営が選定したおすすめマップをリスト形式で表示
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useFeaturedCategoryMaps } from '@/entities/featured-contents';
import { useCurrentUserId } from '@/entities/user';
import { useCategories } from '@/entities/category';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader } from '@/shared/ui';
import { useSafeBack } from '@/shared/lib/navigation';
import { useI18n } from '@/shared/lib/i18n';
import { getTranslatedName, type TranslationsData } from '@/shared/lib/i18n/translate';

export function CategoryFeaturedMapsPage() {
  const router = useRouter();
  const { goBack } = useSafeBack();
  const { locale, t } = useI18n();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const currentUserId = useCurrentUserId();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error, refetch, isRefetching } = useFeaturedCategoryMaps(
    categoryId ?? '',
    currentUserId
  );

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category
    ? getTranslatedName(
        category.name,
        (category as { name_translations?: TranslationsData }).name_translations ?? null,
        locale
      )
    : '';

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
        <PageHeader
          title={t('article.featuredInCategory', { category: categoryName })}
          onBack={goBack}
          useSafeArea={false}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
        </View>
      </SafeAreaView>
    );
  }

  // エラー
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader
          title={t('article.featuredInCategory', { category: categoryName })}
          onBack={goBack}
          useSafeArea={false}
        />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-on-surface-variant text-center">
            {t('article.loadError')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // マップがない場合
  if (!maps || maps.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
        <PageHeader
          title={t('article.featuredInCategory', { category: categoryName })}
          onBack={goBack}
          useSafeArea={false}
        />
        <View className="flex-1 items-center justify-center py-8">
          <Ionicons name="map-outline" size={48} color={themeColors['on-surface-variant']} />
          <Text className="text-on-surface-variant mt-2">
            {t('common.noMaps')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <PageHeader
        title={t('article.featuredInCategory', { category: categoryName })}
        onBack={goBack}
        useSafeArea={false}
      />

      <FlatList
        data={maps}
        keyExtractor={(item) => item.id}
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
