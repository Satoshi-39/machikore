/**
 * タイルベースのキャッシュサービス
 *
 * machi/cities/transport_hubsデータをタイル単位でSupabaseから取得し、SQLiteにキャッシュする
 * LRU方式で最大50タイルまで保持（各エンティティタイプごとに独立）
 */

import { supabase } from '@/shared/api/supabase';
import { getDatabase } from '@/shared/api/sqlite/client';
import { bulkInsertMachi } from '@/shared/api/sqlite/machi';
import { bulkInsertCities } from '@/shared/api/sqlite/cities';
import { bulkInsertTransportHubs } from '@/shared/api/sqlite/transport-hubs';
import type { TransportHubRow, TransportHubType } from '@/shared/api/supabase/transport-hubs';
import { TILE_CACHE_LIMITS } from '@/shared/config/cache';
import type { MapBounds } from '@/shared/lib/utils/tile.utils';
import type { MachiRow, CityRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

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
    prefecture_name_translations: jsonify(machi.prefecture_name_translations),
    city_name_translations: jsonify(machi.city_name_translations),
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
    created_at: (city.created_at as string) || now,
    updated_at: (city.updated_at as string) || now,
  } as CityRow;
}

// ===============================
// タイルキャッシュメタデータ管理
// ===============================

/** キャッシュ対象のエンティティタイプ */
type CacheEntityType = 'machi' | 'cities' | 'transport_hubs';

interface TileCacheMetadata {
  tile_id: string;
  entity_type: CacheEntityType;
  fetched_at: string;
  record_count: number;
  last_accessed_at: string;
}

/**
 * タイルのキャッシュメタデータを取得
 */
function getTileCacheMetadata(tileId: string, entityType: CacheEntityType): TileCacheMetadata | null {
  const db = getDatabase();
  return db.getFirstSync<TileCacheMetadata>(
    'SELECT * FROM cache_metadata WHERE cache_key = ? AND entity_type = ?',
    [`tile:${tileId}`, entityType]
  );
}

/**
 * タイルのキャッシュメタデータを保存/更新
 */
function setTileCacheMetadata(tileId: string, entityType: CacheEntityType, recordCount: number): void {
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
function updateTileAccessTime(tileId: string, entityType: CacheEntityType): void {
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
function getCachedTileCount(entityType: CacheEntityType): number {
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
function evictOldestTile(entityType: CacheEntityType): void {
  const db = getDatabase();

  // 最も古いアクセスのタイルを取得
  const oldest = db.getFirstSync<{ cache_key: string }>(
    "SELECT cache_key FROM cache_metadata WHERE cache_key LIKE 'tile:%' AND entity_type = ? ORDER BY fetched_at ASC LIMIT 1",
    [entityType]
  );

  if (!oldest) return;

  const tileId = oldest.cache_key.replace('tile:', '');
  log.debug(`[TileCache] LRU: 最も古いタイルを削除: ${tileId} (${entityType})`);

  // データを削除
  if (entityType === 'machi') {
    db.runSync('DELETE FROM machi WHERE tile_id = ?', [tileId]);
  } else if (entityType === 'cities') {
    db.runSync('DELETE FROM cities WHERE tile_id = ?', [tileId]);
  } else if (entityType === 'transport_hubs') {
    db.runSync('DELETE FROM transport_hubs WHERE tile_id = ?', [tileId]);
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
function enforceLRULimit(entityType: CacheEntityType): void {
  const count = getCachedTileCount(entityType);
  const limit = TILE_CACHE_LIMITS.maxTiles;

  while (getCachedTileCount(entityType) >= limit) {
    evictOldestTile(entityType);
  }

  if (count >= limit) {
    log.debug(`[TileCache] LRU: ${entityType}タイル数を${limit}以下に調整`);
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
      log.debug(`[TileCache] キャッシュからmachiデータを取得: ${tileId} (${cached.length}件)`);
      return cached;
    }
  }

  // Supabaseから取得
  log.debug(`[TileCache] Supabaseからmachiデータを取得: ${tileId}`);
  const { data, error } = await supabase
    .from('machi')
    .select('*')
    .eq('tile_id', tileId);

  if (error) {
    log.error(`[TileCache] machiデータ取得エラー: ${tileId}`, error);
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
    log.debug(`[TileCache] ${data.length}件のmachiデータをキャッシュ: ${tileId}`);
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
      log.debug(`[TileCache] キャッシュからcitiesデータを取得: ${tileId} (${cached.length}件)`);
      return cached;
    }
  }

  // Supabaseから取得
  log.debug(`[TileCache] Supabaseからcitiesデータを取得: ${tileId}`);
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('tile_id', tileId);

  if (error) {
    log.error(`[TileCache] citiesデータ取得エラー: ${tileId}`, error);
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
// TransportHubsデータ取得
// ===============================

/** SupabaseのtransportHubデータをSQLite用に変換 */
function toSQLiteTransportHub(hub: Record<string, unknown>): TransportHubRow {
  const now = new Date().toISOString();
  return {
    id: hub.id as string,
    osm_id: hub.osm_id as number | null,
    osm_type: hub.osm_type as string | null,
    prefecture_id: hub.prefecture_id as string,
    city_id: hub.city_id as string | null,
    type: hub.type as TransportHubType,
    subtype: hub.subtype as string | null,
    name: hub.name as string,
    name_kana: hub.name_kana as string | null,
    name_translations: hub.name_translations as Record<string, string> | null,
    operator: hub.operator as string | null,
    network: hub.network as string | null,
    ref: hub.ref as string | null,
    latitude: hub.latitude as number,
    longitude: hub.longitude as number,
    tile_id: hub.tile_id as string,
    country_code: (hub.country_code as string) || 'jp',
    created_at: (hub.created_at as string) || now,
    updated_at: (hub.updated_at as string) || now,
  };
}

/**
 * タイルIDから交通機関データを取得（キャッシュ優先）
 */
export async function getTransportHubsByTileId(tileId: string): Promise<TransportHubRow[]> {
  const db = getDatabase();

  // キャッシュをチェック
  const metadata = getTileCacheMetadata(tileId, 'transport_hubs');
  if (metadata) {
    // アクセス時刻を更新
    updateTileAccessTime(tileId, 'transport_hubs');

    const cached = db.getAllSync<TransportHubRow>(
      'SELECT * FROM transport_hubs WHERE tile_id = ?',
      [tileId]
    );
    if (cached.length > 0) {
      log.debug(`[TileCache] キャッシュからtransport_hubsデータを取得: ${tileId} (${cached.length}件)`);
      return cached;
    }
  }

  // Supabaseから取得
  log.debug(`[TileCache] Supabaseからtransport_hubsデータを取得: ${tileId}`);
  const { data, error } = await supabase
    .from('transport_hubs')
    .select('*')
    .eq('tile_id', tileId);

  if (error) {
    log.error(`[TileCache] transport_hubsデータ取得エラー: ${tileId}`, error);
    throw error;
  }

  if (data && data.length > 0) {
    // LRU制限を適用
    enforceLRULimit('transport_hubs');

    // SQLiteにキャッシュ
    const hubsForSQLite = data.map(toSQLiteTransportHub);
    bulkInsertTransportHubs(hubsForSQLite);

    // メタデータを記録
    setTileCacheMetadata(tileId, 'transport_hubs', data.length);
    log.debug(`[TileCache] ${data.length}件のtransport_hubsデータをキャッシュ: ${tileId}`);
  } else {
    // データが0件でもメタデータを記録（再取得を防ぐ）
    setTileCacheMetadata(tileId, 'transport_hubs', 0);
  }

  return (data ?? []) as TransportHubRow[];
}

/**
 * 複数タイルの交通機関データを取得
 */
export async function getTransportHubsByTileIds(tileIds: string[]): Promise<TransportHubRow[]> {
  const results: TransportHubRow[] = [];

  for (const tileId of tileIds) {
    const hubs = await getTransportHubsByTileId(tileId);
    results.push(...hubs);
  }

  return results;
}

/**
 * マップ境界から交通機関データを取得
 */
export async function getTransportHubsByBounds(bounds: MapBounds): Promise<TransportHubRow[]> {
  const { getVisibleTileIds } = await import('@/shared/lib/utils/tile.utils');
  const tileIds = getVisibleTileIds(bounds);
  return getTransportHubsByTileIds(tileIds);
}

// ===============================
// ユーティリティ
// ===============================

/**
 * キャッシュされているタイルIDの一覧を取得
 */
export function getCachedTileIds(entityType: CacheEntityType): string[] {
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
  // 注意: machi/cities/transport_hubsテーブルのデータも削除が必要な場合は別途実装
  log.debug('[TileCache] 全タイルキャッシュをクリア');
}
