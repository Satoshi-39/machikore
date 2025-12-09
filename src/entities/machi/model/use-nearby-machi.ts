/**
 * 現在地近くの街を取得するhook
 */

import { useMemo } from 'react';
import { useMachi } from '../api/use-machi';
import { sortMachiByDistance } from './helpers';
import type { MachiDistance } from './types';

interface UseNearbyMachiParams {
  latitude: number;
  longitude: number;
  limit?: number;
}

/**
 * 現在地から近い街を取得
 */
export function useNearbyMachi({
  latitude,
  longitude,
  limit = 10,
}: UseNearbyMachiParams) {
  // 現在地を渡してその都道府県のデータを取得
  const { data: allMachi, ...rest } = useMachi({
    currentLocation: { latitude, longitude },
  });

  const nearbyMachi = useMemo<MachiDistance[]>(() => {
    if (!allMachi || !latitude || !longitude) return [];

    const sorted = sortMachiByDistance(allMachi, latitude, longitude);
    return sorted.slice(0, limit);
  }, [allMachi, latitude, longitude, limit]);

  return {
    data: nearbyMachi,
    ...rest,
  };
}
