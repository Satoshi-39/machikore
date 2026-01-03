/**
 * マップタイル計算ユーティリティ
 *
 * 座標をタイルIDに変換し、画面表示範囲から必要なタイルを計算
 */

import { MAP_TILE } from '@/shared/config/constants';

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
 * 経度は+180、緯度は+90のオフセットを加えて正規化し、
 * 世界中どこでも正の整数になるようにする
 *
 * @example
 * getTileId(35.6812, 139.7671) // "1279_502" (東京駅)
 */
export function getTileId(latitude: number, longitude: number): string {
  const tileX = Math.floor((longitude + 180) / MAP_TILE.SIZE);
  const tileY = Math.floor((latitude + 90) / MAP_TILE.SIZE);
  return `${tileX}_${tileY}`;
}

/**
 * タイルIDからタイルの境界を計算
 */
export function getTileBounds(tileId: string): MapBounds {
  const parts = tileId.split('_').map(Number);
  const tileX = Number.isNaN(parts[0]) ? 0 : (parts[0] ?? 0);
  const tileY = Number.isNaN(parts[1]) ? 0 : (parts[1] ?? 0);
  return {
    west: tileX * MAP_TILE.SIZE - 180,
    east: (tileX + 1) * MAP_TILE.SIZE - 180,
    south: tileY * MAP_TILE.SIZE - 90,
    north: (tileY + 1) * MAP_TILE.SIZE - 90,
  };
}

/**
 * 画面の表示範囲から必要なタイルIDの配列を取得
 */
export function getVisibleTileIds(bounds: MapBounds): string[] {
  const minX = Math.floor((bounds.west + 180) / MAP_TILE.SIZE);
  const maxX = Math.floor((bounds.east + 180) / MAP_TILE.SIZE);
  const minY = Math.floor((bounds.south + 90) / MAP_TILE.SIZE);
  const maxY = Math.floor((bounds.north + 90) / MAP_TILE.SIZE);

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
