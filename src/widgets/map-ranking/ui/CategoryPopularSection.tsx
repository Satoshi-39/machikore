/**
 * カテゴリ別人気マップセクション
 *
 * 選択されたカテゴリ内で人気のマップを横スクロールで表示
 */

import React from 'react';
import { useCategoryPopularMaps } from '@/entities/map';
import { useCategories } from '@/entities/category';
import { useCurrentUserId } from '@/entities/user';
import { MapRankingSection } from './MapRankingSection';

interface CategoryPopularSectionProps {
  categoryId: string;
}

export function CategoryPopularSection({ categoryId }: CategoryPopularSectionProps) {
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useCategoryPopularMaps(categoryId, 10, currentUserId);

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? '';

  // マップがない場合は何も表示しない
  if (!isLoading && (!maps || maps.length === 0)) {
    return null;
  }

  return (
    <MapRankingSection
      title={`${categoryName}の人気マップ`}
      maps={maps}
      isLoading={isLoading}
      error={error}
      showRank={true}
    />
  );
}
