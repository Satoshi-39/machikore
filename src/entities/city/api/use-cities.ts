/**
 * 市区町村データを取得するhook
 *
 * Supabaseから取得し、TanStack Queryでメモリキャッシュ
 * - 永続化: なし（ユーザーが様々なマップを見るため）
 * - LRU管理: なし（gcTimeで自動解放）
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getNearestPrefecture } from '@/shared/api/sqlite/prefectures';
import { getCitiesByPrefectureId } from '@/shared/api/supabase/places';
import { DYNAMIC_DATA_CACHE_CONFIG } from '@/shared/config';
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
 * 市区町村データを取得（マップ中心座標ベースでSupabaseから取得）
 *
 * 1. マップ中心座標（なければ現在地）から最寄りの都道府県を特定
 * 2. その都道府県の市区町村データをSupabaseから取得
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
      const cities = await getCitiesByPrefectureId(prefectureId);
      console.log(`✅ getCitiesByPrefectureId成功: ${cities.length}件`);
      return cities;
    },
    staleTime: DYNAMIC_DATA_CACHE_CONFIG.staleTime, // 5分
    gcTime: DYNAMIC_DATA_CACHE_CONFIG.gcTime, // 10分（メモリから解放）
  });
}

/**
 * 都道府県単位で市区町村データを取得（Supabaseから取得）
 */
export function useCitiesByPrefecture(prefectureId: string | null) {
  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.citiesByPrefecture(prefectureId || ''),
    queryFn: async () => {
      if (!prefectureId) return [];
      return getCitiesByPrefectureId(prefectureId);
    },
    enabled: !!prefectureId,
    staleTime: DYNAMIC_DATA_CACHE_CONFIG.staleTime, // 5分
    gcTime: DYNAMIC_DATA_CACHE_CONFIG.gcTime, // 10分（メモリから解放）
  });
}
