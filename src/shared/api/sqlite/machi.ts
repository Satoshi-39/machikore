/**
 * 街データ関連のSQLite操作
 */

import { queryOne, queryAll, execute, executeBatch } from './client';
import type { MachiRow } from '@/shared/types/database.types';

// ===============================
// 街データ取得
// ===============================

/**
 * 全街データを取得
 */
export function getAllMachi(): MachiRow[] {
  return queryAll<MachiRow>('SELECT * FROM machi ORDER BY name;');
}

/**
 * IDで街を取得
 */
export function getMachiById(machiId: string): MachiRow | null {
  return queryOne<MachiRow>('SELECT * FROM machi WHERE id = ?;', [machiId]);
}

/**
 * 街名で検索
 */
export function searchMachiByName(searchTerm: string): MachiRow[] {
  return queryAll<MachiRow>(
    'SELECT * FROM machi WHERE name LIKE ? ORDER BY name;',
    [`%${searchTerm}%`]
  );
}

/**
 * 路線で絞り込み
 */
export function getMachiByLine(lineName: string): MachiRow[] {
  return queryAll<MachiRow>(
    'SELECT * FROM machi WHERE line_name = ? ORDER BY name;',
    [lineName]
  );
}

/**
 * 都道府県で絞り込み
 */
export function getMachiByPrefecture(prefecture: string): MachiRow[] {
  return queryAll<MachiRow>(
    'SELECT * FROM machi WHERE prefecture = ? ORDER BY name;',
    [prefecture]
  );
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
  return queryAll<MachiRow>(
    `
    SELECT *,
      ABS(latitude - ?) + ABS(longitude - ?) as distance
    FROM machi
    ORDER BY distance
    LIMIT ?;
    `,
    [latitude, longitude, limit]
  );
}

// ===============================
// 街データ挿入
// ===============================

/**
 * 街データを1件挿入
 */
export function insertMachi(machi: MachiRow): void {
  execute(
    `
    INSERT INTO machi (id, name, latitude, longitude, line_name, prefecture)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    [
      machi.id,
      machi.name,
      machi.latitude,
      machi.longitude,
      machi.line_name,
      machi.prefecture,
    ]
  );
}

/**
 * 複数の街データを一括挿入
 */
export function bulkInsertMachi(machiList: MachiRow[]): void {
  const statements = machiList.map((machi) => ({
    sql: `
      INSERT OR REPLACE INTO machi (id, name, latitude, longitude, line_name, prefecture_id, city_id, prefecture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
    params: [
      machi.id,
      machi.name,
      machi.latitude,
      machi.longitude,
      machi.line_name,
      machi.prefecture_id,
      machi.city_id,
      machi.prefecture,
    ],
  }));

  executeBatch(statements);
}

/**
 * 街データを全削除
 */
export function clearAllMachi(): void {
  execute('DELETE FROM machi;');
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
 * 全路線名を取得
 */
export function getAllLineNames(): string[] {
  const results = queryAll<{ line_name: string }>(
    'SELECT DISTINCT line_name FROM machi ORDER BY line_name;'
  );
  return results.map((r) => r.line_name);
}

/**
 * 全都道府県名を取得（文字列）
 * @deprecated Use getAllPrefectures from prefectures.ts instead
 */
export function getAllPrefectureNames(): string[] {
  const results = queryAll<{ prefecture: string }>(
    'SELECT DISTINCT prefecture FROM machi ORDER BY prefecture;'
  );
  return results.map((r) => r.prefecture);
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
/** @deprecated Use getMachiByLine instead */
export const getStationsByLine = getMachiByLine;
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
