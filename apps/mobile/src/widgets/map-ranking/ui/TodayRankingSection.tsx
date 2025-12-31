/**
 * 本日のランキングセクション
 */

import React from 'react';
import { useTodayPicksMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';
import { MapRankingSection } from './MapRankingSection';

export function TodayRankingSection() {
  const currentUserId = useCurrentUserId();
  const { data: maps, isLoading, error } = useTodayPicksMaps(10, currentUserId);
  const { t } = useI18n();

  return (
    <MapRankingSection
      title={t('section.todaysPicks')}
      maps={maps}
      isLoading={isLoading}
      error={error}
      showRank={false}
      seeAllHref="/(tabs)/discover/today-picks"
    />
  );
}
