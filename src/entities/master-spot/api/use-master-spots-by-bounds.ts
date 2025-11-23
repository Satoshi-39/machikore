/**
 * ビューポート範囲内のマスタースポットを取得するhook
 */

import { useQuery } from '@tanstack/react-query';
import { getMasterSpotsByBounds } from '@/shared/api/sqlite/spots';

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function useMasterSpotsByBounds(bounds: Bounds | null) {
  return useQuery({
    queryKey: bounds
      ? ['master-spots', 'bounds', bounds.minLat, bounds.maxLat, bounds.minLng, bounds.maxLng]
      : ['master-spots', 'bounds', null],
    queryFn: () => {
      if (!bounds) return [];
      return getMasterSpotsByBounds(
        bounds.minLat,
        bounds.maxLat,
        bounds.minLng,
        bounds.maxLng
      );
    },
    enabled: !!bounds,
  });
}
