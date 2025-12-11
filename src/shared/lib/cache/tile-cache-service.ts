/**
 * タイルベースのキャッシュサービス
 *
 * machi/citiesデータをタイル単位でSupabaseから取得し、SQLiteにキャッシュする
 * LRU方式で最大50タイルまで保持
 */

import { supabase } from '@/shared/api/supabase';
import { getDatabase } from '@/shared/api/sqlite/client';
import { bulkInsertMachi } from '@/shared/api/sqlite/machi';
import { bulkInsertCities } from '@/shared/api/sqlite/cities';
import { TILE_CACHE_LIMITS } from '@/shared/config/cache';
import type { MapBounds } from '@/shared/lib/utils/tile.utils';
import type { MachiRow, CityRow } from '@/shared/types/database.types';

// ===============================
// ヘルパー関数
// ===============================

/** JSONフィールドをSQLite用に文字列化 */
const jsonify = (value: unknown): string | null =>
  value ? JSON.stringify(value) : null;

/** SupabaseのmachiデータをSQLite用に変換 */
function toSQLiteMachi(machi: Record<string, unknown>): MachiRow {
  const now = new Date().toISOString();
  return {
    ...machi,
    name_kana: (machi.name_kana as string) || (machi.name as string),
    name_translations: jsonify(machi.name_translations),
    lines: jsonify(machi.lines),
    prefecture_name_translations: jsonify(machi.prefecture_name_translations),
    city_name_translations: jsonify(machi.city_name_translations),
    country_code: (machi.country_code as string) || 'jp',
    prefecture_name: (machi.prefecture_name as string) || '',
    created_at: (machi.created_at as string) || now,
    updated_at: (machi.updated_at as string) || now,
  } as MachiRow;
}

/** SupabaseのcityデータをSQLite用に変換 */
function toSQLiteCity(city: Record<string, unknown>): CityRow {
  const now = new Date().toISOString();
  return {
    ...city,
    name_kana: (city.name_kana as string) || (city.name as string),
    name_translations: jsonify(city.name_translations),
    country_code: (city.country_code as string) || 'jp',
    created_at: (city.created_at as string) || now,
    updated_at: (city.updated_at as string) || now,
  } as CityRow;
}

// ===============================
// タイルキャッシュメタデータ管理
// ===============================

interface TileCacheMetadata {
  tile_id: string;
  entity_type: 'machi' | 'cities';
  fetched_at: string;
  record_count: number;
  last_accessed_at: string;
}

/**
 * タイルのキャッシュメタデータを取得
 */
function getTileCacheMetadata(tileId: string, entityType: 'machi' | 'cities'): TileCacheMetadata | null {
  const db = getDatabase();
  return db.getFirstSync<TileCacheMetadata>(
    'SELECT * FROM cache_metadata WHERE cache_key = ? AND entity_type = ?',
    [`tile:${tileId}`, entityType]
  );
}

/**
 * タイルのキャッシュメタデータを保存/更新
 */
function setTileCacheMetadata(tileId: string, entityType: 'machi' | 'cities', recordCount: number): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  // expires_atは30日後に設定（実際にはLRUで管理するので使用しない）
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  db.runSync(
    `INSERT OR REPLACE INTO cache_metadata (
      cache_key, entity_type, fetched_at, expires_at, record_count
    ) VALUES (?, ?, ?, ?, ?)`,
    [`tile:${tileId}`, entityType, now, expiresAt, recordCount]
  );
}

/**
 * タイルのアクセス時刻を更新（LRU用）
 */
function updateTileAccessTime(tileId: string, entityType: 'machi' | 'cities'): void {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.runSync(
    'UPDATE cache_metadata SET fetched_at = ? WHERE cache_key = ? AND entity_type = ?',
    [now, `tile:${tileId}`, entityType]
  );
}

/**
 * キャッシュされているタイル数を取得
 */
function getCachedTileCount(entityType: 'machi' | 'cities'): number {
  const db = getDatabase();
  const result = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM cache_metadata WHERE cache_key LIKE 'tile:%' AND entity_type = ?",
    [entityType]
  );
  return result?.count ?? 0;
}

/**
 * 最も古いタイルを削除（LRU）
 */
function evictOldestTile(entityType: 'machi' | 'cities'): void {
  const db = getDatabase();

  // 最も古いアクセスのタイルを取得
  const oldest = db.getFirstSync<{ cache_key: string }>(
    "SELECT cache_key FROM cache_metadata WHERE cache_key LIKE 'tile:%' AND entity_type = ? ORDER BY fetched_at ASC LIMIT 1",
    [entityType]
  );

  if (!oldest) return;

  const tileId = oldest.cache_key.replace('tile:', '');
  console.log(`🗑️ LRU: 最も古いタイルを削除: ${tileId} (${entityType})`);

  // データを削除
  if (entityType === 'machi') {
    db.runSync('DELETE FROM machi WHERE tile_id = ?', [tileId]);
  } else {
    db.runSync('DELETE FROM cities WHERE tile_id = ?', [tileId]);
  }

  // メタデータを削除
  db.runSync('DELETE FROM cache_metadata WHERE cache_key = ? AND entity_type = ?', [
    `tile:${tileId}`,
    entityType,
  ]);
}

/**
 * LRU制限を適用（必要に応じて古いタイルを削除）
 */
function enforceLRULimit(entityType: 'machi' | 'cities'): void {
  const count = getCachedTileCount(entityType);
  const limit = TILE_CACHE_LIMITS.maxTiles;

  while (getCachedTileCount(entityType) >= limit) {
    evictOldestTile(entityType);
  }

  if (count >= limit) {
    console.log(`📊 LRU: ${entityType}タイル数を${limit}以下に調整`);
  }
}

// ===============================
// Machiデータ取得
// ===============================

/**
 * タイルIDから街データを取得（キャッシュ優先）
 */
export async function getMachiByTileId(tileId: string): Promise<MachiRow[]> {
  const db = getDatabase();

  // キャッシュをチェック
  const metadata = getTileCacheMetadata(tileId, 'machi');
  if (metadata) {
    // アクセス時刻を更新
    updateTileAccessTime(tileId, 'machi');

    const cached = db.getAllSync<MachiRow>(
      'SELECT * FROM machi WHERE tile_id = ?',
      [tileId]
    );
    if (cached.length > 0) {
      console.log(`📦 キャッシュからmachiデータを取得: ${tileId} (${cached.length}件)`);
      return cached;
    }
  }

  // Supabaseから取得
  console.log(`🌐 Supabaseからmachiデータを取得: ${tileId}`);
  const { data, error } = await supabase
    .from('machi')
    .select('*')
    .eq('tile_id', tileId);

  if (error) {
    console.error(`❌ machiデータ取得エラー: ${tileId}`, error);
    throw error;
  }

  if (data && data.length > 0) {
    // LRU制限を適用
    enforceLRULimit('machi');

    // SQLiteにキャッシュ（共通関数を使用）
    const machiForSQLite = data.map(toSQLiteMachi);
    bulkInsertMachi(machiForSQLite);

    // メタデータを記録
    setTileCacheMetadata(tileId, 'machi', data.length);
    console.log(`✅ ${data.length}件のmachiデータをキャッシュ: ${tileId}`);
  } else {
    // データが0件でもメタデータを記録（再取得を防ぐ）
    setTileCacheMetadata(tileId, 'machi', 0);
  }

  return (data ?? []) as MachiRow[];
}

/**
 * 複数タイルの街データを取得
 */
export async function getMachiByTileIds(tileIds: string[]): Promise<MachiRow[]> {
  const results: MachiRow[] = [];

  for (const tileId of tileIds) {
    const machi = await getMachiByTileId(tileId);
    results.push(...machi);
  }

  return results;
}

/**
 * マップ境界から街データを取得
 */
export async function getMachiByBounds(bounds: MapBounds): Promise<MachiRow[]> {
  const { getVisibleTileIds } = await import('@/shared/lib/utils/tile.utils');
  const tileIds = getVisibleTileIds(bounds);
  return getMachiByTileIds(tileIds);
}

// ===============================
// Citiesデータ取得
// ===============================

/**
 * タイルIDから市区町村データを取得（キャッシュ優先）
 */
export async function getCitiesByTileId(tileId: string): Promise<CityRow[]> {
  const db = getDatabase();

  // キャッシュをチェック
  const metadata = getTileCacheMetadata(tileId, 'cities');
  if (metadata) {
    // アクセス時刻を更新
    updateTileAccessTime(tileId, 'cities');

    const cached = db.getAllSync<CityRow>(
      'SELECT * FROM cities WHERE tile_id = ?',
      [tileId]
    );
    if (cached.length > 0) {
      console.log(`📦 キャッシュからcitiesデータを取得: ${tileId} (${cached.length}件)`);
      return cached;
    }
  }

  // Supabaseから取得
  console.log(`🌐 Supabaseからcitiesデータを取得: ${tileId}`);
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('tile_id', tileId);

  if (error) {
    console.error(`❌ citiesデータ取得エラー: ${tileId}`, error);
    throw error;
  }

  if (data && data.length > 0) {
    // LRU制限を適用
    enforceLRULimit('cities');

    // SQLiteにキャッシュ（共通関数を使用）
    const citiesForSQLite = data.map(toSQLiteCity);
    bulkInsertCities(citiesForSQLite);

    // メタデータを記録
    setTileCacheMetadata(tileId, 'cities', data.length);
  } else {
    // データが0件でもメタデータを記録
    setTileCacheMetadata(tileId, 'cities', 0);
  }

  return (data ?? []) as CityRow[];
}

/**
 * 複数タイルの市区町村データを取得
 */
export async function getCitiesByTileIds(tileIds: string[]): Promise<CityRow[]> {
  const results: CityRow[] = [];

  for (const tileId of tileIds) {
    const cities = await getCitiesByTileId(tileId);
    results.push(...cities);
  }

  return results;
}

/**
 * マップ境界から市区町村データを取得
 */
export async function getCitiesByBounds(bounds: MapBounds): Promise<CityRow[]> {
  const { getVisibleTileIds } = await import('@/shared/lib/utils/tile.utils');
  const tileIds = getVisibleTileIds(bounds);
  return getCitiesByTileIds(tileIds);
}

// ===============================
// ユーティリティ
// ===============================

/**
 * キャッシュされているタイルIDの一覧を取得
 */
export function getCachedTileIds(entityType: 'machi' | 'cities'): string[] {
  const db = getDatabase();
  const results = db.getAllSync<{ cache_key: string }>(
    "SELECT cache_key FROM cache_metadata WHERE cache_key LIKE 'tile:%' AND entity_type = ?",
    [entityType]
  );
  return results.map((r) => r.cache_key.replace('tile:', ''));
}

/**
 * 全タイルキャッシュをクリア
 */
export function clearAllTileCache(): void {
  const db = getDatabase();
  db.runSync("DELETE FROM cache_metadata WHERE cache_key LIKE 'tile:%'");
  // 注意: machi/citiesテーブルのデータも削除が必要な場合は別途実装
  console.log('🗑️ 全タイルキャッシュをクリア');
}
