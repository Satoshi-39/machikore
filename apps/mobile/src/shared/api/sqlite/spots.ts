/**
 * スポット関連のSQLite操作
 */

import { queryOne, queryAll, execute, executeBatch } from './client';
import type { SpotRow, ImageRow } from '@/shared/types/database.types';
import type { SpotWithMasterSpot, UUID } from '@/shared/types';
import { getCurrentLocale } from '@/shared/lib/i18n';
import {
  extractAddressFromString,
  transformRawSpotFromSQLite,
  type RawSpotFromSQLite,
} from '@/shared/lib/utils/multilang.utils';

// ===============================
// ヘルパー関数
// ===============================

/** SQLiteから取得した生データをSpotWithMasterSpot型に変換（現在の言語を使用） */
function transformRawSpot(raw: RawSpotFromSQLite): SpotWithMasterSpot {
  return transformRawSpotFromSQLite(raw, getCurrentLocale());
}

/** スポット取得用の共通SELECT句 */
const SPOT_SELECT_QUERY = `
  SELECT
    s.*,
    ms.name,
    ms.latitude as ms_latitude,
    ms.longitude as ms_longitude,
    ms.google_formatted_address as ms_google_formatted_address,
    ms.google_short_address as ms_google_short_address,
    ms.google_place_id,
    ms.google_types,
    ms.google_phone_number,
    ms.google_website_uri,
    ms.google_rating,
    ms.google_user_rating_count
  FROM user_spots s
  JOIN master_spots ms ON s.master_spot_id = ms.id
`;

// ===============================
// スポット取得
// ===============================

/**
 * IDでスポットを取得（master_spotsと結合）
 */
export function getSpotById(spotId: UUID): SpotWithMasterSpot | null {
  const raw = queryOne<RawSpotFromSQLite>(
    `${SPOT_SELECT_QUERY} WHERE s.id = ?;`,
    [spotId]
  );
  if (!raw) return null;
  return transformRawSpot(raw);
}

/**
 * マップIDからスポット一覧を取得（master_spotsと結合）
 */
export function getSpotsByMapId(mapId: UUID): SpotWithMasterSpot[] {
  const rawList = queryAll<RawSpotFromSQLite>(
    `${SPOT_SELECT_QUERY} WHERE s.map_id = ? ORDER BY s.order_index ASC, s.created_at DESC;`,
    [mapId]
  );
  return rawList.map(transformRawSpot);
}

/**
 * ユーザーの全スポットを取得（master_spotsと結合）
 */
export function getSpotsByUserId(userId: UUID): SpotWithMasterSpot[] {
  const rawList = queryAll<RawSpotFromSQLite>(
    `${SPOT_SELECT_QUERY} WHERE s.user_id = ? ORDER BY s.created_at DESC;`,
    [userId]
  );
  return rawList.map(transformRawSpot);
}

/**
 * 街IDからスポット一覧を取得（master_spotsと結合）
 */
export function getSpotsByMachiId(machiId: string): SpotWithMasterSpot[] {
  const rawList = queryAll<RawSpotFromSQLite>(
    `${SPOT_SELECT_QUERY} WHERE s.machi_id = ? ORDER BY s.created_at DESC;`,
    [machiId]
  );
  return rawList.map(transformRawSpot);
}

// ===============================
// マスタースポット操作
// ===============================

/** SQLiteマスタースポットの型 */
interface MasterSpotFromSQLite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_formatted_address: string | null;
  google_short_address: string | null;
  google_types: string | null;
  google_phone_number: string | null;
  google_website_uri: string | null;
  google_rating: number | null;
  google_user_rating_count: number | null;
}

/**
 * ビューポート範囲内のマスタースポットを取得
 */
export function getMasterSpotsByBounds(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  limit: number = 1000
): MasterSpotFromSQLite[] {
  const language = getCurrentLocale();
  const rawList = queryAll<any>(
    `
    SELECT
      id, name, latitude, longitude,
      google_place_id, google_formatted_address, google_short_address, google_types,
      google_phone_number, google_website_uri,
      google_rating, google_user_rating_count
    FROM master_spots
    WHERE latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
    LIMIT ?;
    `,
    [minLat, maxLat, minLng, maxLng, limit]
  );
  return rawList.map((raw) => ({
    id: raw.id,
    name: raw.name,
    latitude: raw.latitude,
    longitude: raw.longitude,
    google_place_id: raw.google_place_id,
    google_formatted_address: extractAddressFromString(raw.google_formatted_address, language),
    google_short_address: extractAddressFromString(raw.google_short_address, language),
    google_types: raw.google_types,
    google_phone_number: raw.google_phone_number,
    google_website_uri: raw.google_website_uri,
    google_rating: raw.google_rating,
    google_user_rating_count: raw.google_user_rating_count,
  }));
}

/**
 * マスタースポットを挿入または既存のものを取得
 * 同じ名前・位置のマスタースポットが存在する場合はそのIDを返す
 */
export function insertOrGetMasterSpot(masterSpot: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  google_place_id?: string | null;
  google_formatted_address?: string | null;
  google_short_address?: string | null;
  google_types?: string | null;
  google_phone_number?: string | null;
  google_website_uri?: string | null;
  google_rating?: number | null;
  google_user_rating_count?: number | null;
  created_at: string;
  updated_at: string;
}): string {
  // 既存のマスタースポットを探す（名前と座標が一致）
  const existing = queryOne<{ id: string }>(
    `
    SELECT id FROM master_spots
    WHERE name = ? AND ROUND(latitude, 6) = ROUND(?, 6) AND ROUND(longitude, 6) = ROUND(?, 6)
    LIMIT 1;
    `,
    [masterSpot.name, masterSpot.latitude, masterSpot.longitude]
  );

  if (existing) {
    return existing.id;
  }

  // 新しいマスタースポットを挿入
  execute(
    `
    INSERT INTO master_spots (
      id, name, latitude, longitude,
      google_place_id, google_formatted_address, google_short_address, google_types,
      google_phone_number, google_website_uri,
      google_rating, google_user_rating_count,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      masterSpot.id,
      masterSpot.name,
      masterSpot.latitude,
      masterSpot.longitude,
      masterSpot.google_place_id ?? null,
      masterSpot.google_formatted_address ?? null,
      masterSpot.google_short_address ?? null,
      masterSpot.google_types ?? null,
      masterSpot.google_phone_number ?? null,
      masterSpot.google_website_uri ?? null,
      masterSpot.google_rating ?? null,
      masterSpot.google_user_rating_count ?? null,
      masterSpot.created_at,
      masterSpot.updated_at,
    ]
  );

  return masterSpot.id;
}

// ===============================
// スポット作成・更新・削除
// ===============================

/**
 * スポットを挿入（新しいスキーマ用）
 * masterSpotデータを受け取り、master_spotsテーブルに挿入してから、spotsテーブルに挿入する
 */
export function insertSpot(params: {
  spot: SpotRow;
  masterSpot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    google_place_id?: string | null;
    google_formatted_address?: string | null;
    google_short_address?: string | null;
    google_types?: string | null;
    google_phone_number?: string | null;
    google_website_uri?: string | null;
    google_rating?: number | null;
    google_user_rating_count?: number | null;
  };
}): void {
  const { spot, masterSpot } = params;
  const now = new Date().toISOString();

  // 1. マスタースポットを挿入または取得
  const masterSpotId = insertOrGetMasterSpot({
    ...masterSpot,
    created_at: now,
    updated_at: now,
  });

  // 2. スポットを挿入
  // tagsは中間テーブル(spot_tags)で管理するため、ここでは設定しない
  execute(
    `
    INSERT INTO user_spots (
      id, map_id, user_id, machi_id, master_spot_id,
      description, images_count,
      likes_count, comments_count, order_index,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      spot.id,
      spot.map_id,
      spot.user_id,
      spot.machi_id,
      masterSpotId,
      spot.description,
      spot.images_count,
      spot.likes_count,
      spot.comments_count,
      spot.order_index,
      spot.created_at,
      spot.updated_at,
    ]
  );
}

/**
 * スポットを更新（新しいスキーマ用）
 * ユーザーカスタマイズ可能なフィールドのみ更新
 * tagsは中間テーブル(spot_tags)で管理するため、ここでは更新しない
 */
export function updateSpot(
  spotId: UUID,
  updates: {
    description?: string;
    order_index?: number;
  }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (updates.order_index !== undefined) {
    fields.push('order_index = ?');
    values.push(updates.order_index);
  }

  if (fields.length === 0) {
    return;
  }

  fields.push('updated_at = ?');
  values.push(new Date().toISOString());

  values.push(spotId);

  execute(
    `UPDATE user_spots SET ${fields.join(', ')} WHERE id = ?;`,
    values
  );
}

/**
 * スポットを削除
 */
export function deleteSpot(spotId: UUID): void {
  execute('DELETE FROM user_spots WHERE id = ?;', [spotId]);
}

/**
 * マップの全スポットを削除
 */
export function deleteAllSpotsByMapId(mapId: UUID): void {
  execute('DELETE FROM user_spots WHERE map_id = ?;', [mapId]);
}

/**
 * ユーザーの全スポットを削除
 */
export function deleteAllSpotsByUser(userId: UUID): void {
  execute('DELETE FROM user_spots WHERE user_id = ?;', [userId]);
}

// ===============================
// 画像操作
// ===============================

/**
 * スポットの画像一覧を取得
 */
export function getSpotImages(spotId: UUID): ImageRow[] {
  return queryAll<ImageRow>(
    'SELECT * FROM images WHERE user_spot_id = ? ORDER BY order_index ASC;',
    [spotId]
  );
}

/**
 * スポット画像を挿入
 */
export function insertSpotImage(image: ImageRow): void {
  execute(
    `
    INSERT INTO images (
      id, user_spot_id, local_path, cloud_path, width, height,
      file_size, order_index, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      image.id,
      image.user_spot_id,
      image.local_path,
      image.cloud_path,
      image.width,
      image.height,
      image.file_size,
      image.order_index,
      image.created_at,
      image.updated_at,
    ]
  );
}

/**
 * 複数のスポット画像を一括挿入
 */
export function bulkInsertSpotImages(images: ImageRow[]): void {
  const statements = images.map((image) => ({
    sql: `
      INSERT INTO images (
        id, user_spot_id, local_path, cloud_path, width, height,
        file_size, order_index, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    params: [
      image.id,
      image.user_spot_id,
      image.local_path,
      image.cloud_path,
      image.width,
      image.height,
      image.file_size,
      image.order_index,
      image.created_at,
      image.updated_at,
    ],
  }));

  executeBatch(statements);
}

/**
 * 画像を削除
 */
export function deleteSpotImage(imageId: UUID): void {
  execute('DELETE FROM images WHERE id = ?;', [imageId]);
}

/**
 * スポットの全画像を削除
 */
export function deleteAllSpotImages(spotId: UUID): void {
  execute('DELETE FROM images WHERE user_spot_id = ?;', [spotId]);
}

// ===============================
// カウント・統計
// ===============================

/**
 * マップのスポット総数を取得
 */
export function getTotalSpotCount(mapId: UUID): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM user_spots WHERE map_id = ?;',
    [mapId]
  );
  return result?.count ?? 0;
}

/**
 * ユーザーのスポット総数を取得
 */
export function getUserSpotCount(userId: UUID): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM user_spots WHERE user_id = ?;',
    [userId]
  );
  return result?.count ?? 0;
}

/**
 * マップのスポット数を更新
 */
export function updateMapSpotCount(mapId: UUID): void {
  const count = getTotalSpotCount(mapId);
  execute(
    'UPDATE maps SET spots_count = ?, updated_at = ? WHERE id = ?;',
    [count, new Date().toISOString(), mapId]
  );
}

// ===============================
// 発見タブ用
// ===============================

/**
 * 全公開スポットを取得（新着順）
 */
export function getAllPublicSpots(limit: number = 50): SpotWithMasterSpot[] {
  const rawList = queryAll<RawSpotFromSQLite>(
    `${SPOT_SELECT_QUERY}
    JOIN maps m ON s.map_id = m.id
    WHERE m.is_public = 1
    ORDER BY s.created_at DESC
    LIMIT ?;`,
    [limit]
  );
  return rawList.map(transformRawSpot);
}

/**
 * キーワードでスポットを検索
 */
export function searchSpots(query: string, limit: number = 30): SpotWithMasterSpot[] {
  if (!query.trim()) return [];
  const searchPattern = `%${query}%`;
  const rawList = queryAll<RawSpotFromSQLite>(
    `${SPOT_SELECT_QUERY}
    JOIN maps m ON s.map_id = m.id
    WHERE m.is_public = 1
      AND (ms.name LIKE ? OR s.description LIKE ?)
    ORDER BY s.created_at DESC
    LIMIT ?;`,
    [searchPattern, searchPattern, limit]
  );
  return rawList.map(transformRawSpot);
}
