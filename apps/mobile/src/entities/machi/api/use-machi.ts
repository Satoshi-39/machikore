/**
 * 街データを取得するhook
 *
 * タイル単位でSupabaseから取得し、SQLiteにキャッシュ
 * - キャッシュ: SQLiteにタイル単位で保存
 * - LRU: 最大50タイル分をSQLiteに保持
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getAllMachi } from '@/shared/api/sqlite';
import { getMachiByTileIds } from '@/shared/lib/cache';
import { getVisibleTileIds, type MapBounds } from '@/shared/lib/utils/tile.utils';
import { STATIC_DATA_CACHE_CONFIG, MAP_ZOOM } from '@/shared/config';
import type { MachiRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

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

      log.debug(`[Machi] useMachiByBounds: ${tileIds.length}タイル取得`);
      try {
        const machi = await getMachiByTileIds(tileIds);
        log.debug(`[Machi] getMachiByTileIds成功: ${machi.length}件`);
        return machi;
      } catch (error) {
        log.error(`[Machi] queryFnエラー:`, error);
        throw error;
      }
    },
    enabled: tileIds.length > 0,
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日間
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分
    // 新しいデータ取得中も前のデータを表示し続ける（ちらつき防止）
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    tileIds,
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

