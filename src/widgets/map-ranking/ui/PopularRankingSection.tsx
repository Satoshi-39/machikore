/**
 * 人気マップランキングセクション
 */

import React from 'react';
import { usePopularMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { MapRankingSection } from './MapRankingSection';

export function PopularRankingSection() {
  const currentUserId = useCurrentUserId();
  const { data: maps, isLoading, error } = usePopularMaps(10, currentUserId);

  return (
    <MapRankingSection
      title="👑 人気マップランキング"
      maps={maps}
      isLoading={isLoading}
      error={error}
    />
  );
}
