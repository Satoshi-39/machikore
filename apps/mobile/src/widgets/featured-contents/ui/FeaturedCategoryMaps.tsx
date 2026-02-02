/**
 * カテゴリ別おすすめマップWidget
 *
 * 運営が選定したマップを横スクロールで表示
 * ランキングより大きめのカードで目立つように
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useCategories } from '@/entities/category';
import { useFeaturedCategoryMaps } from '@/entities/featured-contents';
import { MapDisplayCard } from '@/widgets/map-cards';
import { useI18n } from '@/shared/lib/i18n';
import { getTranslatedName, type TranslationsData } from '@/shared/lib/i18n/translate';

interface FeaturedCategoryMapsProps {
  categoryId: string;
}

export function FeaturedCategoryMaps({ categoryId }: FeaturedCategoryMapsProps) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useFeaturedCategoryMaps(categoryId, currentUserId);

  const isAll = categoryId === 'all';
  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category
    ? getTranslatedName(category.name, (category as { name_translations?: TranslationsData }).name_translations ?? null, locale)
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

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/discover/users/${userId}` as Href);
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
        <Text className="text-lg font-bold text-on-surface">
          {isAll
            ? t('discover.recommended')
            : t('article.featuredInCategory', { category: categoryName })}
        </Text>
        {/* おすすめマップ一覧ページへの遷移（「すべて」では非表示） */}
        {!isAll && (
          <Pressable
            onPress={() => router.push(`/(tabs)/discover/category-featured-maps/${categoryId}` as Href)}
            className="flex-row items-center active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-forward"
              size={iconSizeNum.md}
              className="text-on-surface-variant"
            />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" className="text-primary" />
        </View>
      ) : error ? (
        <View className="h-40 items-center justify-center">
          <Text className="text-on-surface-variant">
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
              onPress={() => handleArticlePress(map.id)}
              onMapPress={() => handleMapPress(map.id)}
              onUserPress={() => handleUserPress(map.user_id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
