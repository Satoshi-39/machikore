/**
 * カテゴリ別おすすめマップセクションWidget
 *
 * 運営が選定したマップを横スクロールで表示
 * ランキングより大きめのカードで目立つように
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { colors } from '@/shared/config';
import { useCurrentUserId } from '@/entities/user';
import { useCategories } from '@/entities/category';
import { useCategoryFeaturedMaps } from '@/entities/featured-carousel';
import { MapDisplayCard } from '@/widgets/map-cards';
import { useI18n } from '@/shared/lib/i18n';
import { getTranslatedName, type TranslationsData } from '@/shared/lib/i18n/translate';

interface CategoryFeaturedSectionProps {
  categoryId: string;
}

export function CategoryFeaturedSection({ categoryId }: CategoryFeaturedSectionProps) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useCategoryFeaturedMaps(categoryId, currentUserId);

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category
    ? getTranslatedName(category.name, (category as { name_translations?: TranslationsData }).name_translations ?? null, locale)
    : '';

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/discover/maps/${mapId}` as Href);
    },
    [router]
  );

  // データがない場合は表示しない
  if (!isLoading && (!maps || maps.length === 0)) {
    return null;
  }

  return (
    <View className="py-4">
      {/* セクションタイトル */}
      <View className="flex-row items-center justify-between px-4 mb-3">
        <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
          {t('article.featuredInCategory', { category: categoryName })}
        </Text>
        {/* タグページへの遷移 */}
        <Pressable
          onPress={() => router.push(`/(tabs)/discover/category-tags/${categoryId}` as Href)}
          className="flex-row items-center active:opacity-70"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-40 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            {t('article.loadError')}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {maps?.map((map) => (
            <MapDisplayCard
              key={map.id}
              map={map}
              size="medium"
              onPress={() => handleMapPress(map.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
