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
import { getVisibleTileIds, getTileId, type MapBounds } from '@/shared/lib/utils/tile.utils';
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

// ===============================
// 下位互換性のための関数（段階的移行用）
// ===============================

interface UseCitiesOptions {
  /** 現在地（GPS位置、初期表示用） */
  currentLocation?: { latitude: number; longitude: number } | null;
  /** マップ中心座標（マップ移動時のデータ取得用） */
  mapCenter?: { latitude: number; longitude: number } | null;
}

interface UseCitiesResult {
  data: CityRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** @deprecated 都道府県IDは非推奨。タイルIDを使用してください */
  prefectureId: string;
}

/**
 * @deprecated useCitiesByBoundsを使用してください
 *
 * 市区町村データを取得（マップ中心座標ベース）
 * 後方互換性のために残していますが、新規実装ではuseCitiesByBoundsを使用してください
 */
export function useCities(options: UseCitiesOptions = {}): UseCitiesResult {
  const { currentLocation, mapCenter } = options;

  // マップ中心 > 現在地 > デフォルト の優先順位で座標を決定
  const targetLocation = mapCenter || currentLocation;
  const latitude = targetLocation?.latitude ?? 35.6812; // 東京駅
  const longitude = targetLocation?.longitude ?? 139.7671;

  // 中心座標からタイルIDを計算
  const centerTileId = getTileId(latitude, longitude);

  // 中心タイルとその周辺8タイル（3x3）を取得
  const tileIds = useMemo(() => {
    const parts = centerTileId.split('_').map(Number);
    const x = parts[0] ?? 0;
    const y = parts[1] ?? 0;
    const tiles: string[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        tiles.push(`${x + dx}_${y + dy}`);
      }
    }
    return tiles;
  }, [centerTileId]);

  const tileIdsKey = tileIds.sort().join(',');

  const query = useQuery<CityRow[], Error>({
    queryKey: [...QUERY_KEYS.citiesList(), 'center-tiles', tileIdsKey],
    queryFn: async () => {
      console.log(`🏙️ useCities (legacy): center=${centerTileId}, ${tileIds.length}タイル取得`);
      try {
        const cities = await getCitiesByTileIds(tileIds);
        console.log(`✅ getCitiesByTileIds成功: ${cities.length}件`);
        return cities;
      } catch (error) {
        console.error(`❌ queryFnエラー:`, error);
        throw error;
      }
    },
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime,
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    prefectureId: 'tile-based', // 後方互換性のためのダミー値
  };
}

/**
 * @deprecated useCitiesByBoundsを使用してください
 */
export function useCitiesByPrefecture(prefectureId: string | null) {
  console.warn('useCitiesByPrefecture is deprecated. Use useCitiesByBounds instead.');

  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.citiesByPrefecture(prefectureId || ''),
    queryFn: async () => {
      if (!prefectureId) return [];
      return [];
    },
    enabled: false, // 無効化
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime,
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime,
  });
}
