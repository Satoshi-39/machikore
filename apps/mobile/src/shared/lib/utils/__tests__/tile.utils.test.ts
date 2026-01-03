/**
 * tile.utils.ts のテスト
 */

import {
  getTileId,
  getTileBounds,
  getVisibleTileIds,
  filterUncachedTileIds,
} from '../tile.utils';

describe('tile.utils', () => {
  describe('getTileId', () => {
    it('東京駅の座標をタイルIDに変換する', () => {
      // 東京駅: 35.6812, 139.7671
      // tileX = floor((139.7671 + 180) / 0.25) = floor(1279.0684) = 1279
      // tileY = floor((35.6812 + 90) / 0.25) = floor(502.7248) = 502
      expect(getTileId(35.6812, 139.7671)).toBe('1279_502');
    });

    it('ニューヨークの座標をタイルIDに変換する', () => {
      // ニューヨーク: 40.7128, -74.006
      // tileX = floor((-74.006 + 180) / 0.25) = floor(423.976) = 423
      // tileY = floor((40.7128 + 90) / 0.25) = floor(522.8512) = 522
      expect(getTileId(40.7128, -74.006)).toBe('423_522');
    });

    it('原点（0, 0）のタイルID', () => {
      // tileX = floor((0 + 180) / 0.25) = 720
      // tileY = floor((0 + 90) / 0.25) = 360
      expect(getTileId(0, 0)).toBe('720_360');
    });

    it('南西の端（-90, -180）のタイルID', () => {
      // tileX = floor((-180 + 180) / 0.25) = 0
      // tileY = floor((-90 + 90) / 0.25) = 0
      expect(getTileId(-90, -180)).toBe('0_0');
    });

    it('北東の端付近（89, 179）のタイルID', () => {
      // tileX = floor((179 + 180) / 0.25) = floor(1436) = 1436
      // tileY = floor((89 + 90) / 0.25) = floor(716) = 716
      expect(getTileId(89, 179)).toBe('1436_716');
    });
  });

  describe('getTileBounds', () => {
    it('タイルIDから境界を計算する', () => {
      const bounds = getTileBounds('720_360');
      // tileX=720, tileY=360
      // west = 720 * 0.25 - 180 = 0
      // east = 721 * 0.25 - 180 = 0.25
      // south = 360 * 0.25 - 90 = 0
      // north = 361 * 0.25 - 90 = 0.25
      expect(bounds.west).toBe(0);
      expect(bounds.east).toBe(0.25);
      expect(bounds.south).toBe(0);
      expect(bounds.north).toBe(0.25);
    });

    it('原点タイル（0_0）の境界', () => {
      const bounds = getTileBounds('0_0');
      expect(bounds.west).toBe(-180);
      expect(bounds.east).toBe(-179.75);
      expect(bounds.south).toBe(-90);
      expect(bounds.north).toBe(-89.75);
    });

    it('東京駅付近のタイル境界', () => {
      const bounds = getTileBounds('1278_502');
      // west = 1278 * 0.25 - 180 = 139.5
      // east = 1279 * 0.25 - 180 = 139.75
      // south = 502 * 0.25 - 90 = 35.5
      // north = 503 * 0.25 - 90 = 35.75
      expect(bounds.west).toBe(139.5);
      expect(bounds.east).toBe(139.75);
      expect(bounds.south).toBe(35.5);
      expect(bounds.north).toBe(35.75);
    });

    it('不正なタイルIDは0_0として扱う', () => {
      const bounds = getTileBounds('invalid');
      // 不正なIDはタイル(0, 0)として扱われる
      expect(bounds.west).toBe(-180);
      expect(bounds.east).toBe(-179.75);
      expect(bounds.south).toBe(-90);
      expect(bounds.north).toBe(-89.75);
    });
  });

  describe('getVisibleTileIds', () => {
    it('単一タイルの範囲', () => {
      // 0.25度のタイルサイズ内に収まる範囲
      const bounds = {
        north: 35.6,
        south: 35.5,
        east: 139.6,
        west: 139.5,
      };
      const tileIds = getVisibleTileIds(bounds);
      // この範囲は1つのタイルに収まる
      expect(tileIds.length).toBe(1);
    });

    it('複数タイルにまたがる範囲', () => {
      const bounds = {
        north: 36.0,
        south: 35.0,
        east: 140.0,
        west: 139.0,
      };
      const tileIds = getVisibleTileIds(bounds);
      // 経度: 139.0-140.0 = 1度 → 5タイル（境界含む）
      // 緯度: 35.0-36.0 = 1度 → 5タイル（境界含む）
      // 5 x 5 = 25タイル
      expect(tileIds.length).toBe(25);
    });

    it('境界ちょうどの範囲', () => {
      const bounds = {
        north: 0.25,
        south: 0,
        east: 0.25,
        west: 0,
      };
      const tileIds = getVisibleTileIds(bounds);
      expect(tileIds).toContain('720_360');
    });

    it('空の範囲（南北が同じ）でも1タイルを返す', () => {
      const bounds = {
        north: 35.6812,
        south: 35.6812,
        east: 139.7671,
        west: 139.7671,
      };
      const tileIds = getVisibleTileIds(bounds);
      expect(tileIds.length).toBe(1);
    });
  });

  describe('filterUncachedTileIds', () => {
    it('キャッシュにないタイルのみ返す', () => {
      const tileIds = ['1_1', '1_2', '1_3', '2_1'];
      const cached = new Set(['1_1', '2_1']);
      const uncached = filterUncachedTileIds(tileIds, cached);
      expect(uncached).toEqual(['1_2', '1_3']);
    });

    it('すべてキャッシュ済みなら空配列', () => {
      const tileIds = ['1_1', '1_2'];
      const cached = new Set(['1_1', '1_2', '1_3']);
      expect(filterUncachedTileIds(tileIds, cached)).toEqual([]);
    });

    it('キャッシュが空ならすべて返す', () => {
      const tileIds = ['1_1', '1_2', '1_3'];
      const cached = new Set<string>();
      expect(filterUncachedTileIds(tileIds, cached)).toEqual(tileIds);
    });

    it('空のタイル配列は空配列を返す', () => {
      const cached = new Set(['1_1', '1_2']);
      expect(filterUncachedTileIds([], cached)).toEqual([]);
    });
  });
});
