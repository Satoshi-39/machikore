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
    queryKey: ['master-spots', 'bounds', bounds],
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
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}
