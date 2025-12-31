/**
 * 街データ関連のSQLite操作
 *
 * SQLiteではJSONカラムを文字列として保存するため、
 * このDAO層でJSON変換を行い、外部には統一された型を公開する
 */

import { queryOne, queryAll, execute, executeBatch } from './client';
import type { MachiRow } from '@/shared/types/database.types';

// ===============================
// JSON変換ヘルパー
// ===============================

/** SQLiteから取得した生データの型（JSONカラムは文字列） */
interface MachiRowSQLite extends Omit<MachiRow, 'name_translations' | 'prefecture_name_translations' | 'city_name_translations'> {
  name_translations: string | null;
  prefecture_name_translations: string | null;
  city_name_translations: string | null;
}

/** SQLiteの生データをMachiRowに変換（JSON.parse） */
function fromSQLite(row: MachiRowSQLite): MachiRow {
  return {
    ...row,
    name_translations: row.name_translations ? JSON.parse(row.name_translations) : null,
    prefecture_name_translations: row.prefecture_name_translations ? JSON.parse(row.prefecture_name_translations) : null,
    city_name_translations: row.city_name_translations ? JSON.parse(row.city_name_translations) : null,
  };
}

/** MachiRowをSQLite保存用に変換（JSON.stringify） */
function toSQLite(machi: MachiRow): MachiRowSQLite {
  return {
    ...machi,
    name_translations: machi.name_translations ? JSON.stringify(machi.name_translations) : null,
    prefecture_name_translations: machi.prefecture_name_translations ? JSON.stringify(machi.prefecture_name_translations) : null,
    city_name_translations: machi.city_name_translations ? JSON.stringify(machi.city_name_translations) : null,
  };
}

// ===============================
// 街データ取得
// ===============================

/**
 * 全街データを取得
 */
export function getAllMachi(): MachiRow[] {
  const rows = queryAll<MachiRowSQLite>('SELECT * FROM machi ORDER BY name;');
  return rows.map(fromSQLite);
}

/**
 * IDで街を取得
 */
export function getMachiById(machiId: string): MachiRow | null {
  const row = queryOne<MachiRowSQLite>('SELECT * FROM machi WHERE id = ?;', [machiId]);
  return row ? fromSQLite(row) : null;
}

/**
 * 街名で検索
 */
export function searchMachiByName(searchTerm: string): MachiRow[] {
  const rows = queryAll<MachiRowSQLite>(
    'SELECT * FROM machi WHERE name LIKE ? ORDER BY name;',
    [`%${searchTerm}%`]
  );
  return rows.map(fromSQLite);
}

/**
 * 都道府県IDで絞り込み
 */
export function getMachiByPrefectureId(prefectureId: string): MachiRow[] {
  const rows = queryAll<MachiRowSQLite>(
    'SELECT * FROM machi WHERE prefecture_id = ? ORDER BY name;',
    [prefectureId]
  );
  return rows.map(fromSQLite);
}

/**
 * 都道府県で絞り込み
 * @deprecated Use getMachiByPrefectureId instead
 */
export function getMachiByPrefecture(prefectureName: string): MachiRow[] {
  const rows = queryAll<MachiRowSQLite>(
    'SELECT * FROM machi WHERE prefecture_name = ? ORDER BY name;',
    [prefectureName]
  );
  return rows.map(fromSQLite);
}

/**
 * 位置情報から近隣の街を検索（簡易版）
 */
export function getNearbyMachi(
  latitude: number,
  longitude: number,
  limit: number = 10
): MachiRow[] {
  // SQLiteには地理空間関数がないため、簡易的な距離計算
  // より正確な計算が必要な場合は、Haversine公式をアプリ側で実装
  const rows = queryAll<MachiRowSQLite>(
    `
    SELECT *,
      ABS(latitude - ?) + ABS(longitude - ?) as distance
    FROM machi
    ORDER BY distance
    LIMIT ?;
    `,
    [latitude, longitude, limit]
  );
  return rows.map(fromSQLite);
}

// ===============================
// 街データ挿入
// ===============================

/**
 * 街データを1件挿入
 * Note: country_codeは持たない（prefecture_id経由で国を取得）
 */
export function insertMachi(machi: MachiRow): void {
  const row = toSQLite(machi);
  execute(
    `
    INSERT INTO machi (
      id, name, name_kana, name_translations, latitude, longitude,
      prefecture_id, city_id, tile_id, osm_id, place_type, prefecture_name, prefecture_name_translations,
      city_name, city_name_translations, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      row.id,
      row.name,
      row.name_kana,
      row.name_translations,
      row.latitude,
      row.longitude,
      row.prefecture_id,
      row.city_id,
      row.tile_id,
      row.osm_id,
      row.place_type,
      row.prefecture_name,
      row.prefecture_name_translations,
      row.city_name,
      row.city_name_translations,
      row.created_at,
      row.updated_at,
    ]
  );
}

/**
 * 複数の街データを一括挿入
 * Note: country_codeは持たない（prefecture_id経由で国を取得）
 */
export function bulkInsertMachi(machiList: MachiRow[]): void {
  const statements = machiList.map((machi) => {
    const row = toSQLite(machi);
    return {
      sql: `
        INSERT OR REPLACE INTO machi (
          id, name, name_kana, name_translations, latitude, longitude,
          prefecture_id, city_id, tile_id, osm_id, place_type, prefecture_name, prefecture_name_translations,
          city_name, city_name_translations, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      params: [
        row.id,
        row.name,
        row.name_kana,
        row.name_translations,
        row.latitude,
        row.longitude,
        row.prefecture_id,
        row.city_id,
        row.tile_id,
        row.osm_id,
        row.place_type,
        row.prefecture_name,
        row.prefecture_name_translations,
        row.city_name,
        row.city_name_translations,
        row.created_at,
        row.updated_at,
      ],
    };
  });

  executeBatch(statements);
}

/**
 * 街データを全削除
 */
export function clearAllMachi(): void {
  execute('DELETE FROM machi;');
}

/**
 * 特定の都道府県の街データを削除
 */
export function clearMachiByPrefectureId(prefectureId: string): void {
  execute('DELETE FROM machi WHERE prefecture_id = ?;', [prefectureId]);
}

// ===============================
// ユーティリティ
// ===============================

/**
 * 街データの件数を取得
 */
export function getMachiCount(): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM machi;'
  );
  return result?.count ?? 0;
}

/**
 * 全都道府県名を取得（文字列）
 * @deprecated Use getAllPrefectures from prefectures.ts instead
 */
export function getAllPrefectureNames(): string[] {
  const results = queryAll<{ prefecture_name: string }>(
    'SELECT DISTINCT prefecture_name FROM machi ORDER BY prefecture_name;'
  );
  return results.map((r) => r.prefecture_name);
}

// ===============================
// 後方互換性エイリアス（廃止予定）
// ===============================

/** @deprecated Use getAllMachi instead */
export const getAllStations = getAllMachi;
/** @deprecated Use getMachiById instead */
export const getStationById = getMachiById;
/** @deprecated Use searchMachiByName instead */
export const searchStationsByName = searchMachiByName;
/** @deprecated Use getMachiByPrefecture instead */
export const getStationsByPrefecture = getMachiByPrefecture;
/** @deprecated Use getNearbyMachi instead */
export const getNearbyStations = getNearbyMachi;
/** @deprecated Use insertMachi instead */
export const insertStation = insertMachi;
/** @deprecated Use bulkInsertMachi instead */
export const bulkInsertStations = bulkInsertMachi;
/** @deprecated Use clearAllMachi instead */
export const clearAllStations = clearAllMachi;
/** @deprecated Use getMachiCount instead */
export const getStationCount = getMachiCount;
