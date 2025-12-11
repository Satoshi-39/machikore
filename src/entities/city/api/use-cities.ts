/**
 * 市区町村データを取得するhook
 *
 * Supabaseから取得し、SQLiteにキャッシュ + TanStack QueryでLRU管理
 * - 永続化: SQLite（machi-cache-serviceと同じ方式）
 * - LRU管理: 最大5都道府県分（shared/config/cache.tsで設定）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getNearestPrefecture } from '@/shared/api/sqlite/prefectures';
import { getCitiesByPrefecture } from '@/shared/lib/cache/cities-cache-service';
import { STATIC_DATA_CACHE_CONFIG } from '@/shared/config';
import type { CityRow } from '@/shared/types/database.types';

// デフォルトの都道府県ID（東京）
const DEFAULT_PREFECTURE_ID = 'tokyo';

interface UseCitiesOptions {
  /** 現在地（GPS位置、初期表示用） */
  currentLocation?: { latitude: number; longitude: number } | null;
  /** マップ中心座標（マップ移動時のデータ取得用） */
  mapCenter?: { latitude: number; longitude: number } | null;
}

/**
 * 市区町村データを取得（マップ中心座標ベースでSQLiteキャッシュ優先）
 *
 * 1. マップ中心座標（なければ現在地）から最寄りの都道府県を特定
 * 2. その都道府県の市区町村データをSQLiteキャッシュ or Supabaseから取得
 */
export function useCities(options: UseCitiesOptions = {}) {
  const { currentLocation, mapCenter } = options;

  // マップ中心 > 現在地 > デフォルト の優先順位で都道府県を特定
  const targetLocation = mapCenter || currentLocation;
  const prefectureId = targetLocation
    ? getNearestPrefecture(targetLocation.latitude, targetLocation.longitude)?.id ?? DEFAULT_PREFECTURE_ID
    : DEFAULT_PREFECTURE_ID;

  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.citiesByPrefecture(prefectureId),
    queryFn: async () => {
      console.log(`🏙️ useCities queryFn: prefectureId=${prefectureId}`);
      // SQLiteキャッシュサービス経由で取得（キャッシュがあればSQLite、なければSupabase）
      const cities = await getCitiesByPrefecture(prefectureId);
      console.log(`✅ getCitiesByPrefecture成功: ${cities.length}件`);
      return cities;
    },
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日（静的データ）
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分（LRUで管理）
  });
}

/**
 * 都道府県単位で市区町村データを取得（SQLiteキャッシュ優先）
 */
export function useCitiesByPrefecture(prefectureId: string | null) {
  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.citiesByPrefecture(prefectureId || ''),
    queryFn: async () => {
      if (!prefectureId) return [];
      return getCitiesByPrefecture(prefectureId);
    },
    enabled: !!prefectureId,
    staleTime: STATIC_DATA_CACHE_CONFIG.staleTime, // 30日
    gcTime: STATIC_DATA_CACHE_CONFIG.gcTime, // 5分
  });
}
