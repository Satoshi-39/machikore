/**
 * 人気マップランキングセクション
 */

import React from 'react';
import { usePopularMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';
import { MapRankingSection } from './MapRankingSection';

export function PopularRankingSection() {
  const currentUserId = useCurrentUserId();
  const { data: maps, isLoading, error } = usePopularMaps(10, currentUserId);
  const { t } = useI18n();

  return (
    <MapRankingSection
      title={t('section.popularRanking')}
      maps={maps}
      isLoading={isLoading}
      error={error}
      showRank={true}
      seeAllHref="/(tabs)/discover/popular-maps"
    />
  );
}
