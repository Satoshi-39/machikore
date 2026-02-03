/**
 * カテゴリ別新着マップセクション
 *
 * 選択されたカテゴリ内の新着マップを横スクロールで表示
 */

import React from 'react';
import { useCategoryLatestMaps } from '@/entities/map';
import { useCategories } from '@/entities/category';
import { useCurrentUserId } from '@/entities/user';
import { MapRankingSection } from './MapRankingSection';
import { useI18n } from '@/shared/lib/i18n';
import { getTranslatedName, type TranslationsData } from '@/shared/lib/i18n/translate';

interface CategoryLatestSectionProps {
  categoryId: string;
}

export function CategoryLatestSection({ categoryId }: CategoryLatestSectionProps) {
  const { t, locale } = useI18n();
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useCategoryLatestMaps(categoryId, 10, currentUserId);

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category
    ? getTranslatedName(category.name, (category as { name_translations?: TranslationsData }).name_translations ?? null, locale)
    : '';

  // マップがない場合は何も表示しない
  if (!isLoading && (!maps || maps.length === 0)) {
    return null;
  }

  return (
    <MapRankingSection
      title={t('article.latestInCategory', { category: categoryName })}
      maps={maps}
      isLoading={isLoading}
      error={error}
      showRank={false}
      seeAllHref={`/(tabs)/discover/category-maps/${categoryId}?sort=latest`}
    />
  );
}
