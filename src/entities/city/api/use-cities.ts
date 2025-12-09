/**
 * 市区町村データを取得するhook
 *
 * Supabase → SQLiteキャッシュのフローで市区町村データを取得
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { getNearestPrefecture } from '@/shared/api/sqlite/prefectures';
import { getCitiesByPrefecture, getCitiesByLocation, getAllCachedCities } from '@/shared/lib/cache';
import type { CityRow } from '@/shared/types/database.types';

// デフォルトの都道府県ID（東京）
const DEFAULT_PREFECTURE_ID = 'tokyo';

interface UseCitiesOptions {
  /** 現在地（省略時は東京のデータを取得） */
  currentLocation?: { latitude: number; longitude: number } | null;
}

/**
 * 市区町村データを取得（現在地ベースでSupabaseから取得）
 *
 * 1. 現在地から最寄りの都道府県を特定
 * 2. その都道府県の市区町村データをSupabaseから取得（TTLキャッシュ）
 * 3. SQLiteにキャッシュして返す
 */
export function useCities(options: UseCitiesOptions = {}) {
  const { currentLocation } = options;

  // 現在地から都道府県IDを特定（見つからない場合はデフォルト）
  const prefectureId = currentLocation
    ? getNearestPrefecture(currentLocation.latitude, currentLocation.longitude)?.id ?? DEFAULT_PREFECTURE_ID
    : DEFAULT_PREFECTURE_ID;

  return useQuery<CityRow[], Error>({
    queryKey: QUERY_KEYS.citiesByPrefecture(prefectureId),
    queryFn: async () => {
      // 現在地がある場合はその都道府県のデータを取得
      if (currentLocation) {
        const result = await getCitiesByLocation(currentLocation.latitude, currentLocation.longitude);
        if (result && result.cities.length > 0) {
          return result.cities;
        }
      }

      // デフォルトの都道府県のデータを取得
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
