/**
 * 人気マップランキングセクション
 */

import React from 'react';
import { usePopularMaps } from '@/entities/map';
import { MapRankingSection } from './MapRankingSection';

export function PopularRankingSection() {
  const { data: maps, isLoading, error } = usePopularMaps(10);

  return (
    <MapRankingSection
      title="👑 人気マップランキング"
      maps={maps}
      isLoading={isLoading}
      error={error}
    />
  );
}
