/**
 * 市区町村データキャッシュサービス
 *
 * Supabaseから市区町村データを取得し、SQLiteにTTLキャッシュする
 */

import {
  getCitiesByPrefectureId as fetchCitiesFromSupabase,
} from '@/shared/api/supabase/places';
import {
  bulkInsertCities,
  getCitiesByPrefecture as getCitiesFromSQLite,
  getAllCities as getAllCitiesFromSQLite,
} from '@/shared/api/sqlite/cities';
import {
  getNearestPrefecture,
} from '@/shared/api/sqlite/prefectures';
import {
  isCacheValid,
  setCacheMetadata,
  getCitiesCacheKey,
  CACHE_TTL,
} from '@/shared/api/sqlite/cache';
import type { CityRow } from '@/shared/types/database.types';

/**
 * 都道府県の市区町村データを取得（キャッシュ優先）
 *
 * 1. キャッシュが有効 → SQLiteから返す
 * 2. キャッシュが無効/未取得 → Supabaseから取得してキャッシュ
 */
export async function getCitiesByPrefecture(prefectureId: string): Promise<CityRow[]> {
  const cacheKey = getCitiesCacheKey(prefectureId);

  // キャッシュが有効かチェック
  if (isCacheValid(cacheKey)) {
    const cachedData = getCitiesFromSQLite(prefectureId);
    // キャッシュにデータがある場合のみ使用（0件の場合は再取得）
    if (cachedData.length > 0) {
      console.log(`📦 キャッシュから市区町村データを取得: ${prefectureId} (${cachedData.length}件)`);
      return cachedData;
    }
    console.log(`⚠️ キャッシュは有効だがデータが空、Supabaseから再取得: ${prefectureId}`);
  }

  // Supabaseから取得
  console.log(`🌐 Supabaseから市区町村データを取得: ${prefectureId}`);
  try {
    const citiesList = await fetchCitiesFromSupabase(prefectureId);

    if (citiesList.length > 0) {
      // SQLiteにキャッシュ
      const now = new Date().toISOString();
      const citiesWithTimestamps = citiesList.map((c) => ({
        ...c,
        name_kana: c.name_kana || c.name,
        name_translations: c.name_translations ? JSON.stringify(c.name_translations) : null,
        country_code: c.country_code || 'jp',
        created_at: c.created_at || now,
        updated_at: c.updated_at || now,
      })) as CityRow[];

      bulkInsertCities(citiesWithTimestamps);

      // キャッシュメタデータを記録
      setCacheMetadata(cacheKey, 'cities', citiesList.length, CACHE_TTL.CITIES);

      console.log(`✅ ${citiesList.length}件の市区町村データをキャッシュしました: ${prefectureId}`);
    }

    return citiesList as CityRow[];
  } catch (error) {
    console.error(`❌ 市区町村データ取得エラー: ${prefectureId}`, error);

    // エラー時はキャッシュから返す（古くても）
    const cachedData = getCitiesFromSQLite(prefectureId);
    if (cachedData.length > 0) {
      console.log(`⚠️ エラーのため古いキャッシュを使用: ${prefectureId}`);
      return cachedData;
    }

    throw error;
  }
}

/**
 * 現在地から市区町村データを取得
 *
 * 1. 現在地から最寄りの都道府県を特定
 * 2. その都道府県の市区町村データを取得（キャッシュ優先）
 */
export async function getCitiesByLocation(
  latitude: number,
  longitude: number
): Promise<{ prefectureId: string; cities: CityRow[] } | null> {
  // 最寄りの都道府県を特定
  const prefecture = getNearestPrefecture(latitude, longitude);

  if (!prefecture) {
    console.warn('⚠️ 最寄りの都道府県が見つかりません');
    return null;
  }

  console.log(`📍 現在地の都道府県: ${prefecture.name} (${prefecture.id})`);

  // その都道府県の市区町村データを取得
  const cities = await getCitiesByPrefecture(prefecture.id);

  return {
    prefectureId: prefecture.id,
    cities,
  };
}

/**
 * キャッシュされた全市区町村データを取得（SQLiteのみ）
 */
export function getAllCachedCities(): CityRow[] {
  return getAllCitiesFromSQLite();
}
