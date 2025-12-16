/**
 * 交通機関データを取得するhook
 *
 * - useTransportHubsByBounds: タイル単位でSQLiteキャッシュ/Supabaseから取得（デフォルトマップ用）
 * - useTransportHubsForUserMap: マップID単位でキャッシュ（ユーザマップ用）
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getTransportHubsByTileIds } from '@/shared/lib/cache';
import {
  getTransportHubsByBounds as getTransportHubsByBoundsApi,
  type TransportHubType,
  type TransportHubRow,
} from '@/shared/api/supabase';
import { getVisibleTileIds, type MapBounds } from '@/shared/lib/utils/tile.utils';
import { STATIC_DATA_CACHE_CONFIG, MAP_ZOOM, MAP_TILE } from '@/shared/config';
import { log } from '@/shared/config/logger';

// 交通機関タイプと行の型を再エクスポート
export type { TransportHubType, TransportHubRow };

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
 * マップ境界内の交通機関データを取得（タイルベース・デフォルトマップ用）
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

      log.debug(`[TransportHub] useTransportHubsByBounds: ${tileIds.length}タイル取得`);
      try {
        const hubs = await getTransportHubsByTileIds(tileIds);
        log.debug(`[TransportHub] getTransportHubsByTileIds成功: ${hubs.length}件`);

        // タイプでフィルタ（必要な場合）
        if (types && types.length > 0) {
          return hubs.filter((hub) => types.includes(hub.type as TransportHubType));
        }
        return hubs;
      } catch (error) {
        log.error(`[TransportHub] queryFnエラー:`, error);
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

interface UseTransportHubsSimpleOptions {
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
  /** フィルタするタイプ（省略時は全タイプ） */
  types?: TransportHubType[];
}

/**
 * ユーザマップ用の交通機関データを取得（boundsベース）
 *
 * - boundsを小数点1桁（約10km）で丸めてキャッシュキーを生成
 * - 近い場所に戻った時にキャッシュがヒットしやすくなる
 * - デバウンスはhook利用側で行う想定
 */
export function useTransportHubsSimple(options: UseTransportHubsSimpleOptions = {}) {
  const { bounds, zoom = 0, minZoomToFetch = 0, types } = options;

  // boundsを小数点1桁（約10km）で丸めてキャッシュキーを生成
  // これにより、近い場所に戻った時にキャッシュがヒットしやすくなる
  const boundsKey = useMemo(() => {
    if (!bounds) return '';
    if (zoom < minZoomToFetch) return '';
    return `${bounds.minLat.toFixed(1)},${bounds.maxLat.toFixed(1)},${bounds.minLng.toFixed(1)},${bounds.maxLng.toFixed(1)}`;
  }, [bounds, zoom, minZoomToFetch]);

  const enabled = !!boundsKey;

  return useQuery<TransportHubRow[], Error>({
    queryKey: [...QUERY_KEYS.transportHubsList(), 'simple', boundsKey, types?.join(',') ?? 'all'],
    queryFn: async () => {
      if (!bounds) return [];
      return getTransportHubsByBoundsApi(
        bounds.minLat,
        bounds.maxLat,
        bounds.minLng,
        bounds.maxLng,
        types
      );
    },
    enabled,
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime,
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime,
    placeholderData: keepPreviousData,
  });
}
