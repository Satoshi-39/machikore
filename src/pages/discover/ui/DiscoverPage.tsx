/**
 * 発見ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 検索機能を提供
 */

import React, { useState, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DiscoverSearch } from '@/widgets/discover-search';
import { CategoryChips, CATEGORIES, type CategoryId } from '@/widgets/category-chips';
import { FeaturedCarousel } from '@/widgets/featured-carousel';
import { TodayRankingSection, PopularRankingSection } from '@/widgets/map-ranking';
import { AreaSection } from '@/widgets/area-section';
import { CategoryMapsSection } from '@/widgets/category-maps';

export function DiscoverPage() {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  const handleMapPress = () => {
    router.push('/(tabs)/discover/default-map');
  };

  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // 選択されたカテゴリのタグを取得
  const selectedTag = CATEGORIES.find((c) => c.id === selectedCategory)?.tag;

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* 検索バー */}
      <DiscoverSearch
        onFocus={handleSearchFocus}
        onClose={handleSearchClose}
        isSearchFocused={isSearchFocused}
        onMapPress={handleMapPress}
      />

      {/* 検索がフォーカスされていない時のコンテンツ */}
      {!isSearchFocused && (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* カテゴリタブ */}
          <CategoryChips
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {selectedCategory === 'all' ? (
            /* すべて選択時: 通常のコンテンツ表示 */
            <>
              {/* 特集カルーセル */}
              <FeaturedCarousel />

              {/* 本日のピックアップ */}
              <TodayRankingSection />

              {/* 人気マップランキング */}
              <PopularRankingSection />

              {/* エリア別 */}
              <AreaSection />
            </>
          ) : (
            /* カテゴリ選択時: そのカテゴリのマップ一覧 */
            selectedTag && <CategoryMapsSection tag={selectedTag} />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
