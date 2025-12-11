/**
 * 街データを取得するhook
 *
 * タイル単位でSupabaseから取得し、SQLiteにキャッシュ
 * - キャッシュ: SQLiteにタイル単位で保存
 * - LRU: 最大50タイル分をSQLiteに保持
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllMachi } from '@/shared/api/sqlite';
import { getMachiByTileIds } from '@/shared/lib/cache';
import { getVisibleTileIds, getTileId, type MapBounds } from '@/shared/lib/utils/tile.utils';
import { STATIC_DATA_CACHE_CONFIG, MAP_ZOOM } from '@/shared/config';
import type { MachiRow } from '@/shared/types/database.types';

interface UseMachiByBoundsOptions {
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

interface UseMachiByBoundsResult {
  data: MachiRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** 現在取得中のタイルID一覧 */
  tileIds: string[];
}

/**
 * マップ境界内の街データを取得（タイルベース）
 *
 * 1. マップ境界から必要なタイルIDを計算
 * 2. 各タイルのデータをSQLiteキャッシュ or Supabaseから取得
 */
export function useMachiByBounds(options: UseMachiByBoundsOptions = {}): UseMachiByBoundsResult {
  const { bounds, zoom = MAP_ZOOM.MACHI } = options;

  // boundsからタイルIDを計算
  const tileIds = useMemo(() => {
    if (!bounds) return [];
    // ズームがMACHI表示レベル未満の場合は取得しない
    if (zoom < MAP_ZOOM.CITY) return [];

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

  const query = useQuery<MachiRow[], Error>({
    queryKey: [...QUERY_KEYS.machiList(), 'tiles', tileIdsKey],
    queryFn: async () => {
      if (tileIds.length === 0) return [];

      console.log(`🗾 useMachiByBounds: ${tileIds.length}タイル取得`);
      try {
        const machi = await getMachiByTileIds(tileIds);
        console.log(`✅ getMachiByTileIds成功: ${machi.length}件`);
        return machi;
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

interface UseMachiOptions {
  /** 現在地（GPS位置、初期表示用） */
  currentLocation?: { latitude: number; longitude: number } | null;
  /** マップ中心座標（マップ移動時のデータ取得用） */
  mapCenter?: { latitude: number; longitude: number } | null;
}

interface UseMachiResult {
  data: MachiRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  /** @deprecated 都道府県IDは非推奨。タイルIDを使用してください */
  prefectureId: string;
}

/**
 * @deprecated useMachiByBoundsを使用してください
 *
 * 街データを取得（マップ中心座標ベース）
 * 後方互換性のために残していますが、新規実装ではuseMachiByBoundsを使用してください
 */
export function useMachi(options: UseMachiOptions = {}): UseMachiResult {
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

  const query = useQuery<MachiRow[], Error>({
    queryKey: [...QUERY_KEYS.machiList(), 'center-tiles', tileIdsKey],
    queryFn: async () => {
      console.log(`🗾 useMachi (legacy): center=${centerTileId}, ${tileIds.length}タイル取得`);
      try {
        const machi = await getMachiByTileIds(tileIds);
        console.log(`✅ getMachiByTileIds成功: ${machi.length}件`);
        return machi;
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
 * キャッシュされた全街データを取得（SQLiteから同期的に取得）
 *
 * Note: これはSQLiteにキャッシュ済みのデータのみを返します。
 */
export function useCachedMachi() {
  return useQuery<MachiRow[], Error>({
    queryKey: QUERY_KEYS.machiList(),
    queryFn: () => {
      const machiList = getAllMachi();
      return machiList;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

