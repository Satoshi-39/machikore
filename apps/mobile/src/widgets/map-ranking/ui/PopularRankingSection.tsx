/**
 * 人気マップランキングセクション
 */

import React, { useMemo } from 'react';
import { usePopularMaps } from '@/entities/map';
import { useCurrentUserId } from '@/entities/user';
import { useBlockedUserIds } from '@/entities/block';
import { useI18n } from '@/shared/lib/i18n';
import { MapRankingSection } from './MapRankingSection';

export function PopularRankingSection() {
  const currentUserId = useCurrentUserId();
  const { data: rawMaps, isLoading, error } = usePopularMaps(10, currentUserId);
  const { data: blockedUserIds } = useBlockedUserIds(currentUserId);
  const maps = useMemo(
    () => rawMaps?.filter((map) => !blockedUserIds?.has(map.user_id)),
    [rawMaps, blockedUserIds]
  );
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
