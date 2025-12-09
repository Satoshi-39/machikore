/**
 * 街データキャッシュサービス
 *
 * Supabaseから街データを取得し、SQLiteにTTLキャッシュする
 * Google Mapsのタイルキャッシュと同様の仕組み
 */

import {
  getMachiByPrefectureId as fetchMachiFromSupabase,
} from '@/shared/api/supabase/places';
import {
  bulkInsertMachi,
  clearMachiByPrefectureId,
  getMachiByPrefectureId as getMachiFromSQLite,
} from '@/shared/api/sqlite/machi';
import {
  getNearestPrefecture,
} from '@/shared/api/sqlite/prefectures';
import {
  isCacheValid,
  setCacheMetadata,
  getMachiCacheKey,
  CACHE_TTL,
} from '@/shared/api/sqlite/cache';
import type { MachiRow } from '@/shared/types/database.types';

/**
 * 都道府県の街データを取得（キャッシュ優先）
 *
 * 1. キャッシュが有効 → SQLiteから返す
 * 2. キャッシュが無効/未取得 → Supabaseから取得してキャッシュ
 */
export async function getMachiByPrefecture(prefectureId: string): Promise<MachiRow[]> {
  const cacheKey = getMachiCacheKey(prefectureId);

  // キャッシュが有効かチェック
  if (isCacheValid(cacheKey)) {
    const cachedData = getMachiFromSQLite(prefectureId);
    // キャッシュにデータがある場合のみ使用（0件の場合は再取得）
    if (cachedData.length > 0) {
      console.log(`📦 キャッシュから街データを取得: ${prefectureId} (${cachedData.length}件)`);
      return cachedData;
    }
    console.log(`⚠️ キャッシュは有効だがデータが空、Supabaseから再取得: ${prefectureId}`);
  }

  // Supabaseから取得
  console.log(`🌐 Supabaseから街データを取得: ${prefectureId}`);
  try {
    const machiList = await fetchMachiFromSupabase(prefectureId);

    if (machiList.length > 0) {
      // 古いキャッシュを削除
      clearMachiByPrefectureId(prefectureId);

      // SQLiteにキャッシュ
      const now = new Date().toISOString();
      const machiWithTimestamps = machiList.map((m) => ({
        ...m,
        // SQLiteのカラムに合わせる
        name_kana: m.name_kana || m.name,
        lines: m.lines ? JSON.stringify(m.lines) : null,
        name_translations: m.name_translations ? JSON.stringify(m.name_translations) : null,
        prefecture_name_translations: m.prefecture_name_translations
          ? JSON.stringify(m.prefecture_name_translations)
          : null,
        city_name_translations: m.city_name_translations
          ? JSON.stringify(m.city_name_translations)
          : null,
        country_code: m.country_code || 'jp',
        prefecture_name: m.prefecture_name || '',
        created_at: m.created_at || now,
        updated_at: m.updated_at || now,
      })) as MachiRow[];

      bulkInsertMachi(machiWithTimestamps);

      // キャッシュメタデータを記録
      setCacheMetadata(cacheKey, 'machi', machiList.length, CACHE_TTL.MACHI);

      console.log(`✅ ${machiList.length}件の街データをキャッシュしました: ${prefectureId}`);
    }

    return machiList as MachiRow[];
  } catch (error) {
    console.error(`❌ 街データ取得エラー: ${prefectureId}`, error);

    // エラー時はキャッシュから返す（古くても）
    const cachedData = getMachiFromSQLite(prefectureId);
    if (cachedData.length > 0) {
      console.log(`⚠️ エラーのため古いキャッシュを使用: ${prefectureId}`);
      return cachedData;
    }

    throw error;
  }
}

/**
 * キャッシュを強制更新
 */
export async function refreshMachiCache(prefectureId: string): Promise<MachiRow[]> {
  const cacheKey = getMachiCacheKey(prefectureId);

  // キャッシュを無効化（古いメタデータを削除）
  const { deleteCacheMetadata } = await import('@/shared/api/sqlite/cache');
  deleteCacheMetadata(cacheKey);

  // 再取得
  return getMachiByPrefecture(prefectureId);
}

/**
 * 複数の都道府県の街データを取得
 */
export async function getMachiByPrefectures(prefectureIds: string[]): Promise<MachiRow[]> {
  const results: MachiRow[] = [];

  for (const prefectureId of prefectureIds) {
    const machi = await getMachiByPrefecture(prefectureId);
    results.push(...machi);
  }

  return results;
}

/**
 * 現在地から街データを取得
 *
 * 1. 現在地から最寄りの都道府県を特定
 * 2. その都道府県の街データを取得（キャッシュ優先）
 */
export async function getMachiByLocation(
  latitude: number,
  longitude: number
): Promise<{ prefectureId: string; machi: MachiRow[] } | null> {
  // 最寄りの都道府県を特定
  const prefecture = getNearestPrefecture(latitude, longitude);

  if (!prefecture) {
    console.warn('⚠️ 最寄りの都道府県が見つかりません');
    return null;
  }

  console.log(`📍 現在地の都道府県: ${prefecture.name} (${prefecture.id})`);

  // その都道府県の街データを取得
  const machi = await getMachiByPrefecture(prefecture.id);

  return {
    prefectureId: prefecture.id,
    machi,
  };
}

/**
 * アプリ起動時の街データプリフェッチ
 *
 * 位置情報が取得できない場合はデフォルトで東京のデータを取得
 */
export async function prefetchMachiData(
  latitude?: number,
  longitude?: number
): Promise<void> {
  try {
    if (latitude !== undefined && longitude !== undefined) {
      // 現在地から取得
      const result = await getMachiByLocation(latitude, longitude);
      if (result) {
        console.log(`✅ ${result.machi.length}件の街データをプリフェッチ完了`);
        return;
      }
    }

    // 位置情報がない場合はデフォルトで東京
    console.log('📍 位置情報なし、東京のデータをプリフェッチ');
    const machi = await getMachiByPrefecture('tokyo');
    console.log(`✅ ${machi.length}件の街データをプリフェッチ完了（東京）`);
  } catch (error) {
    console.error('❌ 街データプリフェッチエラー:', error);
    // エラーでもアプリは継続
  }
}
