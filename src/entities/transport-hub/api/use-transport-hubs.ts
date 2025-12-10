/**
 * 交通機関データを取得するhook
 *
 * Supabaseから取得し、TanStack Queryでキャッシュ管理
 * - 永続化: AsyncStorageに30日間保存
 * - LRU: 最大5都道府県分をメモリに保持
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getNearestPrefecture } from '@/shared/api/sqlite';
import {
  getTransportHubsByPrefecture,
  getTransportHubsByBounds,
  type TransportHubRow,
  type TransportHubType,
} from '@/shared/api/supabase';
import { STATIC_DATA_CACHE_CONFIG } from '@/shared/config';

// デフォルトの都道府県ID（東京）
const DEFAULT_PREFECTURE_ID = 'tokyo';

interface UseTransportHubsOptions {
  /** 現在地（GPS位置、初期表示用） */
  currentLocation?: { latitude: number; longitude: number } | null;
  /** マップ中心座標（マップ移動時のデータ取得用） */
  mapCenter?: { latitude: number; longitude: number } | null;
  /** 取得する交通機関タイプ（指定しない場合は全タイプ） */
  types?: TransportHubType[];
}

/**
 * 交通機関データを取得（マップ中心座標ベースでSupabaseから取得）
 *
 * 1. マップ中心座標（なければ現在地）から最寄りの都道府県を特定
 * 2. その都道府県の交通機関データをSupabaseから取得
 */
export function useTransportHubs(options: UseTransportHubsOptions = {}) {
  const { currentLocation, mapCenter, types } = options;

  // マップ中心 > 現在地 > デフォルト の優先順位で都道府県を特定
  const targetLocation = mapCenter || currentLocation;
  const prefectureId = targetLocation
    ? getNearestPrefecture(targetLocation.latitude, targetLocation.longitude)?.id ?? DEFAULT_PREFECTURE_ID
    : DEFAULT_PREFECTURE_ID;

  return useQuery<TransportHubRow[], Error>({
    queryKey: [...QUERY_KEYS.transportHubs(), prefectureId, types?.join(',') ?? 'all'],
    queryFn: async () => {
      console.log(`🚃 useTransportHubs queryFn: prefectureId=${prefectureId}`);
      const hubs = await getTransportHubsByPrefecture(prefectureId, types);
      console.log(`✅ getTransportHubsByPrefecture成功: ${hubs.length}件`);
      return hubs;
    },
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日間
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分（メモリから解放、永続化には残る）
  });
}

interface UseTransportHubsByBoundsOptions {
  /** ビューポート境界 */
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null;
  /** 取得する交通機関タイプ */
  types?: TransportHubType[];
  /** 取得上限 */
  limit?: number;
}

/**
 * ビューポート範囲内の交通機関データを取得
 */
export function useTransportHubsByBounds(options: UseTransportHubsByBoundsOptions) {
  const { bounds, types, limit = 500 } = options;

  return useQuery<TransportHubRow[], Error>({
    queryKey: [
      ...QUERY_KEYS.transportHubs(),
      'bounds',
      bounds?.minLat,
      bounds?.maxLat,
      bounds?.minLng,
      bounds?.maxLng,
      types?.join(',') ?? 'all',
    ],
    queryFn: async () => {
      if (!bounds) return [];
      return getTransportHubsByBounds(
        bounds.minLat,
        bounds.maxLat,
        bounds.minLng,
        bounds.maxLng,
        types,
        limit
      );
    },
    enabled: !!bounds,
    staleTime: 5 * 60 * 1000, // 5分
    gcTime: 30 * 60 * 1000, // 30分
  });
}
