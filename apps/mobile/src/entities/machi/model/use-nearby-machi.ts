/**
 * 現在地近くの街を取得するhook
 */

import { useMemo } from 'react';
import { useMachiByBounds } from '../api/use-machi';
import { sortMachiByDistance } from './helpers';
import { MAP_TILE } from '@/shared/config';
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
  // 現在地周辺のboundsを計算（タイル1つ分 = 約25km四方）
  const bounds = useMemo(() => {
    if (!latitude || !longitude) return null;
    const halfSize = MAP_TILE.SIZE; // 0.25度 = 約25km
    return {
      minLat: latitude - halfSize,
      maxLat: latitude + halfSize,
      minLng: longitude - halfSize,
      maxLng: longitude + halfSize,
    };
  }, [latitude, longitude]);

  // タイルベースで街データを取得
  const { data: allMachi, ...rest } = useMachiByBounds({ bounds });

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
