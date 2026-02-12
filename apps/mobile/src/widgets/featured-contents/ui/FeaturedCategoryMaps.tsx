/**
 * カテゴリ別おすすめマップWidget
 *
 * 運営が選定したマップを横スクロールで表示
 * ランキングより大きめのカードで目立つように
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useCategories } from '@/entities/category';
import { useRecommendMaps } from '@/entities/map';
import { useBlockedUserIds } from '@/entities/block';
import { MapDisplayCard } from '@/widgets/map-cards';
import { MapDisplayCardSkeleton } from '@/shared/ui/skeleton';
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
  const { data: rawMaps, isLoading, error } = useRecommendMaps(categoryId, currentUserId);
  const { data: blockedUserIds } = useBlockedUserIds(currentUserId);
  const maps = useMemo(
    () => rawMaps?.filter((map) => !blockedUserIds?.has(map.user_id)),
    [rawMaps, blockedUserIds]
  );

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
        <Pressable
          onPress={() => router.push(`/(tabs)/discover/category-maps/${categoryId}?sort=recommend` as Href)}
          className="flex-row items-center active:opacity-70"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="chevron-forward"
            size={iconSizeNum.md}
            className="text-on-surface-variant"
          />
        </Pressable>
      </View>

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <MapDisplayCardSkeleton key={i} size="medium" />
          ))}
        </ScrollView>
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
              onUserPress={() => handleUserPress(map.user_id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
