/**
 * 発見ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 検索機能を提供
 */

import React, { useState, useCallback } from 'react';
import { ScrollView, View, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { CategoryChips, type CategoryId } from '@/widgets/category-chips';
import { FeaturedItems, FeaturedCategoryMaps } from '@/widgets/featured-contents';
import { useFeaturedItems } from '@/entities/featured-contents';
import { RecentlyViewedSection } from '@/widgets/recently-viewed';
import {
  TodayRankingSection,
  PopularRankingSection,
  CategoryPopularSection,
  CategoryLatestSection,
} from '@/widgets/map-ranking';
import { AreaSection } from '@/widgets/area-section';
import { WorldSection } from '@/widgets/world-section';
import { useI18n } from '@/shared/lib/i18n';
import { AdBanner } from '@/shared/ui/ad';
import { BannerAdSize } from 'react-native-google-mobile-ads';

export function DiscoverPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // カテゴリ別の特集アイテムを取得
  const { data: featuredItems } = useFeaturedItems(selectedCategory);

  // 検索バータップで検索画面に遷移
  const handleSearchPress = useCallback(() => {
    router.push('/(tabs)/discover/search');
  }, [router]);

  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']} testID="discover-screen">
      {/* 検索バー（タップで検索画面に遷移） */}
      <View className="flex-row items-center px-4 py-2 bg-surface">
        <Pressable
          testID="discover-search-bar"
          onPress={handleSearchPress}
          className="flex-1 flex-row items-center bg-secondary rounded-full px-4 py-3"
        >
          <Ionicons name="search-outline" size={iconSizeNum.md} className="text-on-surface-variant" />
          <Text className="flex-1 ml-2 text-base text-on-surface-variant">
            {t('discover.searchPlaceholder')}
          </Text>
        </Pressable>
      </View>

      {/* コンテンツ */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* カテゴリタブ */}
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {selectedCategory === 'all' ? (
            /* すべて選択時: 通常のコンテンツ表示 */
            <>
              {/* 特集がある場合はカルーセル、なければ全カテゴリ横断のおすすめマップ */}
              {featuredItems && featuredItems.length > 0 ? (
                <FeaturedItems />
              ) : (
                <FeaturedCategoryMaps categoryId="all" />
              )}

              {/* 最近見たマップ（ログイン時のみ表示） */}
              <RecentlyViewedSection />

              {/* 本日のピックアップ */}
              <TodayRankingSection />

              {/* 人気マップランキング */}
              <PopularRankingSection />

              {/* バナー広告（プレミアムユーザーには自動的に非表示） */}
              <AdBanner size={BannerAdSize.LARGE_BANNER} scale={1.15} className="mt-6 mb-6 items-center" />

              {/* エリア別（日本） */}
              <AreaSection />

              {/* 海外 - リリース後に有効化 */}
              {/* <WorldSection /> */}
            </>
          ) : (
            /* カテゴリ選択時: 特集/おすすめ + 新着 + 人気 */
            <>
              {/* 特集がある場合はカルーセル、なければ運営選定のおすすめマップ */}
              {featuredItems && featuredItems.length > 0 ? (
                <FeaturedItems categoryId={selectedCategory} />
              ) : (
                <FeaturedCategoryMaps categoryId={selectedCategory} />
              )}

              {/* 新着マップ */}
              <CategoryLatestSection categoryId={selectedCategory} />

              {/* 人気マップ */}
              <CategoryPopularSection categoryId={selectedCategory} />

              {/* バナー広告（プレミアムユーザーには自動的に非表示） */}
              <AdBanner size={BannerAdSize.LARGE_BANNER} scale={1.15} className="mt-6 mb-6 items-center" />

              {/* エリアから探す */}
              <AreaSection categoryId={selectedCategory} />
            </>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}
