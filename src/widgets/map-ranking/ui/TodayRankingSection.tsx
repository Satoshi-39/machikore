/**
 * 本日のランキングセクション
 */

import React from 'react';
import { useTodayPicksMaps } from '@/entities/map';
import { MapRankingSection } from './MapRankingSection';

export function TodayRankingSection() {
  const { data: maps, isLoading, error } = useTodayPicksMaps(10);

  return (
    <MapRankingSection
      title="🔥 本日のピックアップ"
      maps={maps}
      isLoading={isLoading}
      error={error}
    />
  );
}
