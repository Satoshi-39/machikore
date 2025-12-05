/**
 * ビューポート範囲内のマスタースポットを取得するhook
 * Supabaseから全ユーザーのマスタースポットを取得
 */

import { useQuery } from '@tanstack/react-query';
import { getMasterSpotsByBounds } from '@/shared/api/supabase/master-spots';

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
    // ちらつき防止: 新しいデータ取得中も前のデータを表示し続ける
    placeholderData: (previousData) => previousData,
    // キャッシュを5分間保持
    staleTime: 5 * 60 * 1000,
  });
}
