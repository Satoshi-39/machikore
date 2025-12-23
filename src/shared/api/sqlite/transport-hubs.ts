/**
 * 交通機関データ関連のSQLite操作
 */

import { queryOne, queryAll, execute, executeBatch } from './client';
import type { TransportHubRow } from '@/shared/api/supabase/transport-hubs';

// 型を再エクスポート
export type { TransportHubRow };

// ===============================
// 交通機関データ取得
// ===============================

/**
 * 全交通機関データを取得
 */
export function getAllTransportHubs(): TransportHubRow[] {
  return queryAll<TransportHubRow>('SELECT * FROM transport_hubs ORDER BY name;');
}

/**
 * IDで交通機関を取得
 */
export function getTransportHubById(hubId: string): TransportHubRow | null {
  return queryOne<TransportHubRow>('SELECT * FROM transport_hubs WHERE id = ?;', [hubId]);
}

/**
 * タイルIDで交通機関を取得
 */
export function getTransportHubsByTileId(tileId: string): TransportHubRow[] {
  return queryAll<TransportHubRow>(
    'SELECT * FROM transport_hubs WHERE tile_id = ? ORDER BY name;',
    [tileId]
  );
}

/**
 * 都道府県IDで絞り込み
 */
export function getTransportHubsByPrefectureId(prefectureId: string): TransportHubRow[] {
  return queryAll<TransportHubRow>(
    'SELECT * FROM transport_hubs WHERE prefecture_id = ? ORDER BY name;',
    [prefectureId]
  );
}

/**
 * タイプで絞り込み（station, airport, ferry_terminal, bus_terminal）
 */
export function getTransportHubsByType(type: string): TransportHubRow[] {
  return queryAll<TransportHubRow>(
    'SELECT * FROM transport_hubs WHERE type = ? ORDER BY name;',
    [type]
  );
}

/**
 * 名前で検索
 */
export function searchTransportHubsByName(searchTerm: string): TransportHubRow[] {
  return queryAll<TransportHubRow>(
    'SELECT * FROM transport_hubs WHERE name LIKE ? ORDER BY name;',
    [`%${searchTerm}%`]
  );
}

// ===============================
// 交通機関データ挿入
// ===============================

/**
 * 交通機関データを1件挿入
 */
export function insertTransportHub(hub: TransportHubRow): void {
  execute(
    `
    INSERT INTO transport_hubs (
      id, osm_id, osm_type, prefecture_id, city_id, type, subtype,
      name, name_kana, name_translations, operator, network, ref,
      latitude, longitude, tile_id, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      hub.id,
      hub.osm_id,
      hub.osm_type,
      hub.prefecture_id,
      hub.city_id,
      hub.type,
      hub.subtype,
      hub.name,
      hub.name_kana,
      hub.name_translations ? JSON.stringify(hub.name_translations) : null,
      hub.operator,
      hub.network,
      hub.ref,
      hub.latitude,
      hub.longitude,
      hub.tile_id,
      hub.created_at,
      hub.updated_at,
    ]
  );
}

/**
 * 複数の交通機関データを一括挿入
 */
export function bulkInsertTransportHubs(hubs: TransportHubRow[]): void {
  const statements = hubs.map((hub) => ({
    sql: `
      INSERT OR REPLACE INTO transport_hubs (
        id, osm_id, osm_type, prefecture_id, city_id, type, subtype,
        name, name_kana, name_translations, operator, network, ref,
        latitude, longitude, tile_id, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    params: [
      hub.id,
      hub.osm_id,
      hub.osm_type,
      hub.prefecture_id,
      hub.city_id,
      hub.type,
      hub.subtype,
      hub.name,
      hub.name_kana,
      hub.name_translations ? JSON.stringify(hub.name_translations) : null,
      hub.operator,
      hub.network,
      hub.ref,
      hub.latitude,
      hub.longitude,
      hub.tile_id,
      hub.created_at,
      hub.updated_at,
    ],
  }));

  executeBatch(statements);
}

/**
 * 交通機関データを全削除
 */
export function clearAllTransportHubs(): void {
  execute('DELETE FROM transport_hubs;');
}

/**
 * 特定のタイルの交通機関データを削除
 */
export function clearTransportHubsByTileId(tileId: string): void {
  execute('DELETE FROM transport_hubs WHERE tile_id = ?;', [tileId]);
}

// ===============================
// ユーティリティ
// ===============================

/**
 * 交通機関データの件数を取得
 */
export function getTransportHubCount(): number {
  const result = queryOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM transport_hubs;'
  );
  return result?.count ?? 0;
}
