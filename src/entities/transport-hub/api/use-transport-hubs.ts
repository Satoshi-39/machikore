/**
 * 交通機関データを取得するhook
 *
 * タイル単位でSupabaseから取得し、SQLiteにキャッシュ
 * - キャッシュ: SQLiteにタイル単位で保存
 * - LRU: 最大50タイル分をSQLiteに保持
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getTransportHubsByTileIds } from '@/shared/lib/cache';
import { getVisibleTileIds, type MapBounds } from '@/shared/lib/utils/tile.utils';
import { STATIC_DATA_CACHE_CONFIG, MAP_ZOOM, MAP_TILE } from '@/shared/config';
import type { TransportHubRow } from '@/shared/api/sqlite/transport-hubs';

// 交通機関タイプの定義
export type TransportHubType = 'station' | 'airport' | 'ferry_terminal' | 'bus_terminal';

interface UseTransportHubsByBoundsOptions {
  /** マップの境界 */
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null;
  /** 現在のズームレベル */
  zoom?: number;
  /** フィルタするタイプ（省略時は全タイプ） */
  types?: TransportHubType[];
}

interface UseTransportHubsByBoundsResult {
  data: TransportHubRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** 現在取得中のタイルID一覧 */
  tileIds: string[];
}

/**
 * マップ境界内の交通機関データを取得（タイルベース）
 *
 * 1. マップ境界から必要なタイルIDを計算
 * 2. 各タイルのデータをSQLiteキャッシュ or Supabaseから取得
 */
export function useTransportHubsByBounds(
  options: UseTransportHubsByBoundsOptions = {}
): UseTransportHubsByBoundsResult {
  const { bounds, zoom = MAP_ZOOM.MACHI, types } = options;

  // boundsからタイルIDを計算
  const tileIds = useMemo(() => {
    if (!bounds) return [];
    // ズームがCITY表示レベル未満の場合は取得しない（広範囲での大量リクエスト防止）
    if (zoom < MAP_ZOOM.CITY) return [];

    const mapBounds: MapBounds = {
      north: bounds.maxLat,
      south: bounds.minLat,
      east: bounds.maxLng,
      west: bounds.minLng,
    };
    const tiles = getVisibleTileIds(mapBounds);

    // タイル数が多すぎる場合は取得しない（過剰なリクエスト防止）
    if (tiles.length > MAP_TILE.MAX_TRANSPORT_TILES) {
      return [];
    }

    return tiles;
  }, [bounds, zoom]);

  // タイルIDをキーにしてクエリ
  const tileIdsKey = tileIds.sort().join(',');

  const query = useQuery<TransportHubRow[], Error>({
    queryKey: [...QUERY_KEYS.transportHubsList(), 'tiles', tileIdsKey, types?.join(',') ?? 'all'],
    queryFn: async () => {
      if (tileIds.length === 0) return [];

      console.log(`🚃 useTransportHubsByBounds: ${tileIds.length}タイル取得`);
      try {
        const hubs = await getTransportHubsByTileIds(tileIds);
        console.log(`✅ getTransportHubsByTileIds成功: ${hubs.length}件`);

        // タイプでフィルタ（必要な場合）
        if (types && types.length > 0) {
          return hubs.filter((hub) => types.includes(hub.type as TransportHubType));
        }
        return hubs;
      } catch (error) {
        console.error(`❌ queryFnエラー:`, error);
        throw error;
      }
    },
    enabled: tileIds.length > 0,
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日間
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    tileIds,
  };
}

// 型の再エクスポート
export type { TransportHubRow };
