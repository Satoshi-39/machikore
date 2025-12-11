/**
 * マップタイル計算ユーティリティ
 *
 * 座標をタイルIDに変換し、画面表示範囲から必要なタイルを計算
 */

import { MAP_TILE } from '@/shared/config';

/**
 * マップの境界（バウンディングボックス）
 */
export interface MapBounds {
  north: number; // 北端の緯度
  south: number; // 南端の緯度
  east: number; // 東端の経度
  west: number; // 西端の経度
}

/**
 * 座標からタイルIDを計算
 *
 * @example
 * getTileId(35.6812, 139.7671) // "559_142" (東京駅)
 */
export function getTileId(latitude: number, longitude: number): string {
  const tileX = Math.floor(longitude / MAP_TILE.SIZE);
  const tileY = Math.floor(latitude / MAP_TILE.SIZE);
  return `${tileX}_${tileY}`;
}

/**
 * タイルIDからタイルの境界を計算
 */
export function getTileBounds(tileId: string): MapBounds {
  const parts = tileId.split('_').map(Number);
  const tileX = parts[0] ?? 0;
  const tileY = parts[1] ?? 0;
  return {
    west: tileX * MAP_TILE.SIZE,
    east: (tileX + 1) * MAP_TILE.SIZE,
    south: tileY * MAP_TILE.SIZE,
    north: (tileY + 1) * MAP_TILE.SIZE,
  };
}

/**
 * 画面の表示範囲から必要なタイルIDの配列を取得
 */
export function getVisibleTileIds(bounds: MapBounds): string[] {
  const minX = Math.floor(bounds.west / MAP_TILE.SIZE);
  const maxX = Math.floor(bounds.east / MAP_TILE.SIZE);
  const minY = Math.floor(bounds.south / MAP_TILE.SIZE);
  const maxY = Math.floor(bounds.north / MAP_TILE.SIZE);

  const tileIds: string[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      tileIds.push(`${x}_${y}`);
    }
  }
  return tileIds;
}

/**
 * タイルIDの配列からキャッシュにないものだけをフィルタリング
 */
export function filterUncachedTileIds(
  tileIds: string[],
  cachedTileIds: Set<string>
): string[] {
  return tileIds.filter((id) => !cachedTileIds.has(id));
}
