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

interface CategoryLatestSectionProps {
  categoryId: string;
}

export function CategoryLatestSection({ categoryId }: CategoryLatestSectionProps) {
  const currentUserId = useCurrentUserId();
  const { data: categories = [] } = useCategories();
  const { data: maps, isLoading, error } = useCategoryLatestMaps(categoryId, 10, currentUserId);

  const categoryName = categories.find((c) => c.id === categoryId)?.name ?? '';

  // マップがない場合は何も表示しない
  if (!isLoading && (!maps || maps.length === 0)) {
    return null;
  }

  return (
    <MapRankingSection
      title={`${categoryName}の新着マップ`}
      maps={maps}
      isLoading={isLoading}
      error={error}
      showRank={false}
    />
  );
}
