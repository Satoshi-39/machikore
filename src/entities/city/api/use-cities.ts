/**
 * 市区町村データを取得するhook
 *
 * タイル単位でSupabaseから取得し、SQLiteにキャッシュ
 * - キャッシュ: SQLiteにタイル単位で保存
 * - LRU: 最大50タイル分をSQLiteに保持
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getCitiesByTileIds } from '@/shared/lib/cache';
import { getVisibleTileIds, type MapBounds } from '@/shared/lib/utils/tile.utils';
import { STATIC_DATA_CACHE_CONFIG, MAP_ZOOM } from '@/shared/config';
import type { CityRow } from '@/shared/types/database.types';

interface UseCitiesByBoundsOptions {
  /** マップの境界 */
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null;
  /** 現在のズームレベル */
  zoom?: number;
}

interface UseCitiesByBoundsResult {
  data: CityRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** 現在取得中のタイルID一覧 */
  tileIds: string[];
}

/**
 * マップ境界内の市区町村データを取得（タイルベース）
 *
 * 1. マップ境界から必要なタイルIDを計算
 * 2. 各タイルのデータをSQLiteキャッシュ or Supabaseから取得
 */
export function useCitiesByBounds(options: UseCitiesByBoundsOptions = {}): UseCitiesByBoundsResult {
  const { bounds, zoom = MAP_ZOOM.CITY } = options;

  // boundsからタイルIDを計算
  const tileIds = useMemo(() => {
    if (!bounds) return [];
    // ズームがCITY表示レベル未満の場合は取得しない
    if (zoom < MAP_ZOOM.PREFECTURE) return [];

    const mapBounds: MapBounds = {
      north: bounds.maxLat,
      south: bounds.minLat,
      east: bounds.maxLng,
      west: bounds.minLng,
    };
    return getVisibleTileIds(mapBounds);
  }, [bounds, zoom]);

  // タイルIDをキーにしてクエリ
  const tileIdsKey = tileIds.sort().join(',');

  const query = useQuery<CityRow[], Error>({
    queryKey: [...QUERY_KEYS.citiesList(), 'tiles', tileIdsKey],
    queryFn: async () => {
      if (tileIds.length === 0) return [];

      console.log(`🏙️ useCitiesByBounds: ${tileIds.length}タイル取得`);
      try {
        const cities = await getCitiesByTileIds(tileIds);
        console.log(`✅ getCitiesByTileIds成功: ${cities.length}件`);
        return cities;
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

