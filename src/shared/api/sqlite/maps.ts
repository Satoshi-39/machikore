/**
 * Maps テーブル操作
 */

import { getDatabase } from './client';
import type { MapRow, MapInsert, MapUpdate } from '@/shared/types/database.types';

// ===============================
// 作成
// ===============================

/**
 * マップを挿入（IDは必須）
 */
export function insertMap(map: MapInsert & { id: string }): void {
  const db = getDatabase();
  const now = new Date().toISOString();

  // tagsは中間テーブル(map_tags)で管理するため、ここでは設定しない
  db.runSync(
    `INSERT INTO maps (
      id, user_id, name, description, category_id,
      is_public, is_official, thumbnail_url,
      spots_count, likes_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      map.id,
      map.user_id,
      map.name,
      map.description ?? null,
      map.category_id ?? null,
      map.is_public ?? true,
      map.is_official ?? false,
      map.thumbnail_url ?? null,
      map.spots_count ?? 0,
      map.likes_count ?? 0,
      map.created_at ?? now,
      map.updated_at ?? now,
    ]
  );
}

// ===============================
// 取得
// ===============================

/**
 * IDでマップを取得
 */
export function getMapById(mapId: string): MapRow | null {
  const db = getDatabase();
  return db.getFirstSync<MapRow>(
    'SELECT * FROM maps WHERE id = ?;',
    [mapId]
  );
}

/**
 * ユーザーIDでマップを取得（作成日時降順）
 */
export function getMapsByUserId(userId: string): MapRow[] {
  const db = getDatabase();
  return db.getAllSync<MapRow>(
    'SELECT * FROM maps WHERE user_id = ? ORDER BY created_at DESC;',
    [userId]
  );
}

/**
 * 公開マップを取得
 */
export function getPublicMaps(): MapRow[] {
  const db = getDatabase();
  return db.getAllSync<MapRow>(
    'SELECT * FROM maps WHERE is_public = 1 ORDER BY created_at DESC;'
  );
}

/**
 * 全マップを取得
 */
export function getAllMaps(): MapRow[] {
  const db = getDatabase();
  return db.getAllSync<MapRow>(
    'SELECT * FROM maps ORDER BY created_at DESC;'
  );
}

// ===============================
// 更新
// ===============================

/**
 * マップ情報を更新
 */
export function updateMap(
  mapId: string,
  updates: MapUpdate
): void {
  const db = getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  // 更新フィールドを動的に構築
  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.category_id !== undefined) {
    fields.push('category_id = ?');
    values.push(updates.category_id);
  }
  // tagsは中間テーブル(map_tags)で管理するため、ここでは更新しない
  if (updates.is_public !== undefined) {
    fields.push('is_public = ?');
    values.push(updates.is_public);
  }
  if (updates.is_official !== undefined) {
    fields.push('is_official = ?');
    values.push(updates.is_official);
  }
  if (updates.thumbnail_url !== undefined) {
    fields.push('thumbnail_url = ?');
    values.push(updates.thumbnail_url);
  }
  if (updates.spots_count !== undefined) {
    fields.push('spots_count = ?');
    values.push(updates.spots_count);
  }
  if (updates.likes_count !== undefined) {
    fields.push('likes_count = ?');
    values.push(updates.likes_count);
  }
  if (updates.updated_at !== undefined) {
    fields.push('updated_at = ?');
    values.push(updates.updated_at);
  }

  if (fields.length === 0) return;

  values.push(mapId);

  db.runSync(
    `UPDATE maps SET ${fields.join(', ')} WHERE id = ?;`,
    values
  );
}

// ===============================
// 削除
// ===============================

/**
 * マップを削除
 */
export function deleteMap(mapId: string): void {
  const db = getDatabase();
  db.runSync('DELETE FROM maps WHERE id = ?;', [mapId]);
}

/**
 * 全マップを削除
 */
export function deleteAllMaps(): void {
  const db = getDatabase();
  db.runSync('DELETE FROM maps;');
}

// ===============================
// 発見タブ用
// ===============================

/**
 * キーワードでマップを検索
 */
export function searchMaps(query: string, limit: number = 30): MapRow[] {
  if (!query.trim()) return [];
  const db = getDatabase();
  const searchPattern = `%${query}%`;
  return db.getAllSync<MapRow>(
    `SELECT * FROM maps
     WHERE is_public = 1
       AND (name LIKE ? OR description LIKE ?)
     ORDER BY created_at DESC
     LIMIT ?;`,
    [searchPattern, searchPattern, limit]
  );
}
