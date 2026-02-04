/**
 * カテゴリ別マップ一覧ページ
 *
 * カテゴリの新着マップ・人気マップ・おすすめマップをリスト形式で表示
 */

import React, { useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';
import { useCurrentUserId } from '@/entities/user';
import { useCategoryPopularMaps, useCategoryLatestMaps, useRecommendMaps } from '@/entities/map';
import { useCategories } from '@/entities/category';
import { MapListCard } from '@/widgets/map-cards';
import { PageHeader, AsyncBoundary } from '@/shared/ui';
import { useSafeBack, useCurrentTab } from '@/shared/lib';
import { useI18n } from '@/shared/lib/i18n';
import { getTranslatedName, type TranslationsData } from '@/shared/lib/i18n/translate';

interface CategoryMapsPageProps {
  categoryId: string;
  sort: 'latest' | 'popular' | 'recommend';
}

export function CategoryMapsPage({ categoryId, sort }: CategoryMapsPageProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { goBack } = useSafeBack();
  const currentTab = useCurrentTab();
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category
    ? getTranslatedName(
        category.name,
        (category as { name_translations?: TranslationsData }).name_translations ?? null,
        locale
      )
    : '';

  const isPopular = sort === 'popular';
  const isRecommend = sort === 'recommend';
  const isAll = categoryId === 'all';

  const popularQuery = useCategoryPopularMaps(
    isPopular ? categoryId : '',
    30,
    currentUserId
  );
  const latestQuery = useCategoryLatestMaps(
    !isPopular && !isRecommend ? categoryId : '',
    30,
    currentUserId
  );
  const recommendQuery = useRecommendMaps(
    isRecommend ? categoryId : '',
    currentUserId
  );

  const { data: maps, isLoading, error, refetch, isRefetching } = isRecommend
    ? recommendQuery
    : isPopular
      ? popularQuery
      : latestQuery;

  const title = isRecommend
    ? isAll
      ? t('discover.recommended')
      : t('article.featuredInCategory', { category: categoryName })
    : isPopular
      ? t('section.popularInCategory', { category: categoryName })
      : t('article.latestInCategory', { category: categoryName });

  const handleArticlePress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/articles/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleMapPress = useCallback(
    (mapId: string) => {
      router.push(`/(tabs)/${currentTab}/maps/${mapId}` as Href);
    },
    [router, currentTab]
  );

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(tabs)/${currentTab}/users/${userId}` as Href);
    },
    [router, currentTab]
  );

  return (
    <SafeAreaView
      className="flex-1 bg-surface"
      edges={['top']}
    >
      <PageHeader title={title} onBack={goBack} useSafeArea={false} />

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        data={maps && maps.length > 0 ? maps : null}
        emptyMessage={isRecommend ? t('common.noMaps') : t('section.noPopularMaps')}
        emptyIonIcon={isRecommend ? 'map-outline' : isPopular ? 'trending-up-outline' : 'time-outline'}
      >
        {(data) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MapListCard
                map={item}
                currentUserId={currentUserId}
                isOwner={item.user_id === currentUserId}
                rank={isPopular ? index + 1 : undefined}
                onPress={() => handleArticlePress(item.id)}
                onUserPress={handleUserPress}
                onMapPress={handleMapPress}
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
