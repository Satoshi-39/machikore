/**
 * スポット関連のSQLite操作
 */

import { queryOne, queryAll, execute, executeBatch } from './client';
import type { SpotRow, ImageRow } from '@/shared/types/database.types';
import type { UUID } from '@/shared/types';

// ===============================
// スポット取得
// ===============================

/**
 * IDでスポットを取得
 */
export function getSpotById(spotId: UUID): SpotRow | null {
  return queryOne<SpotRow>('SELECT * FROM spots WHERE id = ?;', [spotId]);
}

/**
 * マップIDからスポット一覧を取得
 */
export function getSpotsByMapId(mapId: UUID): SpotRow[] {
  return queryAll<SpotRow>(
    'SELECT * FROM spots WHERE map_id = ? ORDER BY order_index ASC, created_at DESC;',
    [mapId]
  );
}

/**
 * ユーザーの全スポットを取得
 */
export function getSpotsByUserId(userId: UUID): SpotRow[] {
  return queryAll<SpotRow>(
    'SELECT * FROM spots WHERE user_id = ? ORDER BY created_at DESC;',
    [userId]
  );
}

/**
 * 街IDからスポット一覧を取得
 */
export function getSpotsByMachiId(machiId: string): SpotRow[] {
  return queryAll<SpotRow>(
    'SELECT * FROM spots WHERE machi_id = ? ORDER BY created_at DESC;',
    [machiId]
  );
}

// ===============================
// スポット作成・更新・削除
// ===============================

/**
 * スポットを挿入
 */
export function insertSpot(spot: SpotRow): void {
  execute(
    `
    INSERT INTO spots (
      id, map_id, user_id, machi_id, name, address,
      latitude, longitude, memo, images_count,
      likes_count, comments_count, order_index,
      created_at, updated_at, synced_at, is_synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      spot.id,
      spot.map_id,
      spot.user_id,
      spot.machi_id,
      spot.name,
      spot.address,
      spot.latitude,
      spot.longitude,
      spot.memo,
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
 * スポットを更新
 */
export function updateSpot(
  spotId: UUID,
  updates: {
    name?: string;
    address?: string | null;
    latitude?: number;
    longitude?: number;
    memo?: string | null;
    order_index?: number;
  }
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }

  if (updates.address !== undefined) {
    fields.push('address = ?');
    values.push(updates.address);
  }

  if (updates.latitude !== undefined) {
    fields.push('latitude = ?');
    values.push(updates.latitude);
  }

  if (updates.longitude !== undefined) {
    fields.push('longitude = ?');
    values.push(updates.longitude);
  }

  if (updates.memo !== undefined) {
    fields.push('memo = ?');
    values.push(updates.memo);
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
    `UPDATE spots SET ${fields.join(', ')} WHERE id = ?;`,
    values
  );
}

/**
 * スポットを削除
 */
export function deleteSpot(spotId: UUID): void {
  execute('DELETE FROM spots WHERE id = ?;', [spotId]);
}

/**
 * マップの全スポットを削除
 */
export function deleteAllSpotsByMapId(mapId: UUID): void {
  execute('DELETE FROM spots WHERE map_id = ?;', [mapId]);
}

/**
 * ユーザーの全スポットを削除
 */
export function deleteAllSpotsByUser(userId: UUID): void {
  execute('DELETE FROM spots WHERE user_id = ?;', [userId]);
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
    'SELECT COUNT(*) as count FROM spots WHERE map_id = ?;',
    [mapId]
  );
  return result?.count ?? 0;
}

/**
 * ユーザーのスポット総数を取得
 */
export function getUserSpotCount(userId: UUID): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM spots WHERE user_id = ?;',
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
