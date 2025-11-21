/**
 * スポット関連のSQLite操作
 */

import { queryOne, queryAll, execute, executeBatch } from './client';
import type { SpotRow, SpotWithMasterSpot, ImageRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';

// ===============================
// スポット取得
// ===============================

/**
 * IDでスポットを取得（master_spotsと結合）
 */
export function getSpotById(spotId: UUID): SpotWithMasterSpot | null {
  return queryOne<SpotWithMasterSpot>(
    `
    SELECT
      s.*,
      ms.name,
      ms.latitude,
      ms.longitude,
      ms.mapbox_place_id,
      ms.mapbox_place_name,
      ms.mapbox_category,
      ms.mapbox_address as address,
      ms.mapbox_context
    FROM user_spots s
    JOIN master_spots ms ON s.master_spot_id = ms.id
    WHERE s.id = ?;
    `,
    [spotId]
  );
}

/**
 * マップIDからスポット一覧を取得（master_spotsと結合）
 */
export function getSpotsByMapId(mapId: UUID): SpotWithMasterSpot[] {
  return queryAll<SpotWithMasterSpot>(
    `
    SELECT
      s.*,
      ms.name,
      ms.latitude,
      ms.longitude,
      ms.mapbox_place_id,
      ms.mapbox_place_name,
      ms.mapbox_category,
      ms.mapbox_address as address,
      ms.mapbox_context
    FROM user_spots s
    JOIN master_spots ms ON s.master_spot_id = ms.id
    WHERE s.map_id = ?
    ORDER BY s.order_index ASC, s.created_at DESC;
    `,
    [mapId]
  );
}

/**
 * ユーザーの全スポットを取得（master_spotsと結合）
 */
export function getSpotsByUserId(userId: UUID): SpotWithMasterSpot[] {
  return queryAll<SpotWithMasterSpot>(
    `
    SELECT
      s.*,
      ms.name,
      ms.latitude,
      ms.longitude,
      ms.mapbox_place_id,
      ms.mapbox_place_name,
      ms.mapbox_category,
      ms.mapbox_address as address,
      ms.mapbox_context
    FROM user_spots s
    JOIN master_spots ms ON s.master_spot_id = ms.id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC;
    `,
    [userId]
  );
}

/**
 * 街IDからスポット一覧を取得（master_spotsと結合）
 */
export function getSpotsByMachiId(machiId: string): SpotWithMasterSpot[] {
  return queryAll<SpotWithMasterSpot>(
    `
    SELECT
      s.*,
      ms.name,
      ms.latitude,
      ms.longitude,
      ms.mapbox_place_id,
      ms.mapbox_place_name,
      ms.mapbox_category,
      ms.mapbox_address as address,
      ms.mapbox_context
    FROM user_spots s
    JOIN master_spots ms ON s.master_spot_id = ms.id
    WHERE s.machi_id = ?
    ORDER BY s.created_at DESC;
    `,
    [machiId]
  );
}

// ===============================
// マスタースポット操作
// ===============================

/**
 * マスタースポットを挿入または既存のものを取得
 * 同じ名前・位置のマスタースポットが存在する場合はそのIDを返す
 */
export function insertOrGetMasterSpot(masterSpot: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  mapbox_place_id?: string | null;
  mapbox_place_name?: string | null;
  mapbox_category?: string | null;
  mapbox_address?: string | null;
  mapbox_context?: string | null;
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
      id, name, latitude, longitude, mapbox_place_id, mapbox_place_name,
      mapbox_category, mapbox_address, mapbox_context,
      created_at, updated_at, synced_at, is_synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0);
    `,
    [
      masterSpot.id,
      masterSpot.name,
      masterSpot.latitude,
      masterSpot.longitude,
      masterSpot.mapbox_place_id ?? null,
      masterSpot.mapbox_place_name ?? null,
      masterSpot.mapbox_category ?? null,
      masterSpot.mapbox_address ?? null,
      masterSpot.mapbox_context ?? null,
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
    mapbox_place_id?: string | null;
    mapbox_place_name?: string | null;
    mapbox_category?: string | null;
    mapbox_address?: string | null;
    mapbox_context?: string | null;
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
  execute(
    `
    INSERT INTO user_spots (
      id, map_id, user_id, machi_id, master_spot_id,
      custom_name, description, tags, images_count,
      likes_count, comments_count, order_index,
      created_at, updated_at, synced_at, is_synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      spot.id,
      spot.map_id,
      spot.user_id,
      spot.machi_id,
      masterSpotId,
      spot.custom_name ?? null,
      spot.description ?? null,
      spot.tags ?? null,
      spot.images_count,
      spot.likes_count,
      spot.comments_count,
      spot.order_index,
      spot.created_at,
      spot.updated_at,
      spot.synced_at,
      spot.is_synced,
    ]
  );
}

/**
 * スポットを更新（新しいスキーマ用）
 * ユーザーカスタマイズ可能なフィールドのみ更新
 */
export function updateSpot(
  spotId: UUID,
  updates: {
    custom_name?: string | null;
    description?: string | null;
    tags?: string | null;
    order_index?: number;
  }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.custom_name !== undefined) {
    fields.push('custom_name = ?');
    values.push(updates.custom_name);
  }

  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (updates.tags !== undefined) {
    fields.push('tags = ?');
    values.push(updates.tags);
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
    'SELECT * FROM images WHERE spot_id = ? ORDER BY order_index ASC;',
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
      id, spot_id, local_path, cloud_path, width, height,
      file_size, order_index, created_at, updated_at, synced_at, is_synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      image.id,
      image.spot_id,
      image.local_path,
      image.cloud_path,
      image.width,
      image.height,
      image.file_size,
      image.order_index,
      image.created_at,
      image.updated_at,
      image.synced_at,
      image.is_synced,
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
        id, spot_id, local_path, cloud_path, width, height,
        file_size, order_index, created_at, updated_at, synced_at, is_synced
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    params: [
      image.id,
      image.spot_id,
      image.local_path,
      image.cloud_path,
      image.width,
      image.height,
      image.file_size,
      image.order_index,
      image.created_at,
      image.updated_at,
      image.synced_at,
      image.is_synced,
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
  execute('DELETE FROM images WHERE spot_id = ?;', [spotId]);
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
