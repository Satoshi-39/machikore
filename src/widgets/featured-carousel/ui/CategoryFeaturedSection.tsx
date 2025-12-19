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
import { useIsDarkMode } from '@/shared/lib/providers';
import { useCurrentUserId } from '@/entities/user';
import { useCategories } from '@/entities/category';
import { useCategoryFeaturedMaps } from '@/entities/featured-carousel';
import { MapDisplayCard } from '@/widgets/map-cards';

interface CategoryFeaturedSectionProps {
  categoryId: string;
}

export function CategoryFeaturedSection({ categoryId }: CategoryFeaturedSectionProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useCategoryFeaturedMaps(categoryId, currentUserId);

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? '';

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
          {categoryName}のおすすめ
        </Text>
        {/* タグページへの遷移ボタン */}
        <Pressable
          onPress={() => router.push(`/(tabs)/discover/category-tags/${categoryId}` as Href)}
          className="flex-row items-center px-3 py-1.5 rounded-full active:opacity-70"
          style={{
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : colors.gray[100],
            borderWidth: 1,
            borderColor: isDarkMode ? colors.primary.light : colors.primary.DEFAULT,
          }}
        >
          <Ionicons
            name="pricetag-outline"
            size={14}
            color={isDarkMode ? colors.primary.light : colors.primary.DEFAULT}
          />
          <Text
            className="text-sm font-medium ml-1"
            style={{ color: isDarkMode ? colors.primary.light : colors.primary.DEFAULT }}
          >
            タグで探す
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View className="h-40 items-center justify-center">
          <Text className="text-foreground-muted dark:text-dark-foreground-muted">
            読み込みに失敗しました
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
