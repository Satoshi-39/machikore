/**
 * 本日のランキングセクション
 */

import React from 'react';
import { useTodayPicksMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { MapRankingSection } from './MapRankingSection';

export function TodayRankingSection() {
  const currentUserId = useCurrentUserId();
  const { data: maps, isLoading, error } = useTodayPicksMaps(10, currentUserId);

  return (
    <MapRankingSection
      title="本日のピックアップ"
      maps={maps}
      isLoading={isLoading}
      error={error}
      showRank={false}
      seeAllHref="/(tabs)/discover/today-picks"
    />
  );
}
