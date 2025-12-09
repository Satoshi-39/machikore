/**
 * 市区町村データを取得するhook
 *
 * Supabase → SQLiteキャッシュのフローで市区町村データを取得
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getNearestPrefecture } from '@/shared/api/sqlite/prefectures';
import { getCitiesByPrefecture, getAllCachedCities } from '@/shared/lib/cache';
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
 * 2. その都道府県の市区町村データをSupabaseから取得（TTLキャッシュ）
 * 3. SQLiteにキャッシュして返す
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
      return getCitiesByPrefecture(prefectureId);
    },
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7日間（TTLと合わせる）
    gcTime: Infinity,
  });
}

/**
 * キャッシュされた全市区町村データを取得（SQLiteから同期的に取得）
 *
 * Note: これはSQLiteにキャッシュ済みのデータのみを返します。
 * 新しいデータを取得する場合は useCities を使用してください。
 */
export function useCachedCities() {
  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.cities(),
    queryFn: () => getAllCachedCities(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
