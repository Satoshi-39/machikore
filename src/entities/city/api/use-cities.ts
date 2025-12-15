/**
 * 市区町村データを取得するhook
 *
 * - useCitiesByBounds: タイル単位でSupabaseから取得（デフォルトマップ用）
 * - useCitiesForUserMap: マップID単位でキャッシュ（ユーザマップ用）
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getCitiesByTileIds } from '@/shared/lib/cache';
import { getCitiesByBounds as getCitiesByBoundsApi } from '@/shared/api/supabase';
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
  /** データ取得を開始する最小ズームレベル（デフォルト: MAP_ZOOM.CITY） */
  minZoomToFetch?: number;
}

interface UseCitiesByBoundsResult {
  data: CityRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** 現在取得中のタイルID一覧 */
  tileIds: string[];
}

/**
 * マップ境界内の市区町村データを取得（タイルベース・デフォルトマップ用）
 *
 * 1. マップ境界から必要なタイルIDを計算
 * 2. 各タイルのデータをSQLiteキャッシュ or Supabaseから取得
 */
export function useCitiesByBounds(options: UseCitiesByBoundsOptions = {}): UseCitiesByBoundsResult {
  const { bounds, zoom = MAP_ZOOM.CITY, minZoomToFetch = MAP_ZOOM.CITY } = options;

  // boundsからタイルIDを計算
  const tileIds = useMemo(() => {
    if (!bounds) return [];
    // ズームが最小レベル未満の場合は取得しない
    if (zoom < minZoomToFetch) return [];

    const mapBounds: MapBounds = {
      north: bounds.maxLat,
      south: bounds.minLat,
      east: bounds.maxLng,
      west: bounds.minLng,
    };
    return getVisibleTileIds(mapBounds);
  }, [bounds, zoom, minZoomToFetch]);

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
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime,
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime,
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    tileIds,
  };
}

// ===============================
// ユーザマップ用（boundsベース・粗いroundingでキャッシュヒット率向上）
// ===============================

interface UseCitiesSimpleOptions {
  /** マップの境界 */
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null;
  /** 現在のズームレベル */
  zoom?: number;
  /** データ取得を開始する最小ズームレベル */
  minZoomToFetch?: number;
}

/**
 * ユーザマップ用の市区町村データを取得（boundsベース）
 *
 * - boundsを小数点1桁（約10km）で丸めてキャッシュキーを生成
 * - 近い場所に戻った時にキャッシュがヒットしやすくなる
 * - デバウンスはhook利用側で行う想定
 */
export function useCitiesSimple(options: UseCitiesSimpleOptions = {}) {
  const { bounds, zoom = 0, minZoomToFetch = 0 } = options;

  // boundsを小数点1桁（約10km）で丸めてキャッシュキーを生成
  // これにより、近い場所に戻った時にキャッシュがヒットしやすくなる
  const boundsKey = useMemo(() => {
    if (!bounds) return '';
    if (zoom < minZoomToFetch) return '';
    return `${bounds.minLat.toFixed(1)},${bounds.maxLat.toFixed(1)},${bounds.minLng.toFixed(1)},${bounds.maxLng.toFixed(1)}`;
  }, [bounds, zoom, minZoomToFetch]);

  const enabled = !!boundsKey;

  return useQuery<CityRow[], Error>({
    queryKey: [...QUERY_KEYS.citiesList(), 'simple', boundsKey],
    queryFn: async () => {
      if (!bounds) return [];
      return getCitiesByBoundsApi(bounds);
    },
    enabled,
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime,
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime,
    placeholderData: keepPreviousData,
  });
}
