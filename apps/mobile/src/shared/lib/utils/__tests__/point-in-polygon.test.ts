/**
 * point-in-polygon.ts のテスト
 */

import { pointInGeometry } from '../point-in-polygon';

describe('point-in-polygon', () => {
  describe('pointInGeometry - Polygon', () => {
    // 東京駅周辺の四角形ポリゴン
    const tokyoSquare = {
      type: 'Polygon' as const,
      coordinates: [
        [
          [139.76, 35.68], // 左下
          [139.78, 35.68], // 右下
          [139.78, 35.69], // 右上
          [139.76, 35.69], // 左上
          [139.76, 35.68], // 閉じる
        ],
      ],
    };

    it('ポリゴン内の点はtrueを返す', () => {
      expect(pointInGeometry(139.77, 35.685, tokyoSquare)).toBe(true);
    });

    it('ポリゴン外の点はfalseを返す', () => {
      expect(pointInGeometry(139.75, 35.685, tokyoSquare)).toBe(false);
    });

    it('ポリゴンの上の点はfalseを返す', () => {
      expect(pointInGeometry(139.77, 35.70, tokyoSquare)).toBe(false);
    });

    it('ポリゴンの下の点はfalseを返す', () => {
      expect(pointInGeometry(139.77, 35.67, tokyoSquare)).toBe(false);
    });
  });

  describe('pointInGeometry - Polygon with hole', () => {
    // 穴（ドーナツ型）のあるポリゴン
    const donutPolygon = {
      type: 'Polygon' as const,
      coordinates: [
        // 外側のリング
        [
          [139.70, 35.60],
          [139.80, 35.60],
          [139.80, 35.70],
          [139.70, 35.70],
          [139.70, 35.60],
        ],
        // 穴（内側のリング）
        [
          [139.74, 35.64],
          [139.76, 35.64],
          [139.76, 35.66],
          [139.74, 35.66],
          [139.74, 35.64],
        ],
      ],
    };

    it('外側リング内かつ穴の外の点はtrueを返す', () => {
      expect(pointInGeometry(139.72, 35.62, donutPolygon)).toBe(true);
    });

    it('穴の中の点はfalseを返す', () => {
      expect(pointInGeometry(139.75, 35.65, donutPolygon)).toBe(false);
    });

    it('外側リングの外の点はfalseを返す', () => {
      expect(pointInGeometry(139.65, 35.65, donutPolygon)).toBe(false);
    });
  });

  describe('pointInGeometry - MultiPolygon', () => {
    // 2つの離れた四角形
    const multiPolygon = {
      type: 'MultiPolygon' as const,
      coordinates: [
        // 1つ目のポリゴン（左側）
        [
          [
            [139.70, 35.68],
            [139.72, 35.68],
            [139.72, 35.70],
            [139.70, 35.70],
            [139.70, 35.68],
          ],
        ],
        // 2つ目のポリゴン（右側）
        [
          [
            [139.78, 35.68],
            [139.80, 35.68],
            [139.80, 35.70],
            [139.78, 35.70],
            [139.78, 35.68],
          ],
        ],
      ],
    };

    it('1つ目のポリゴン内の点はtrueを返す', () => {
      expect(pointInGeometry(139.71, 35.69, multiPolygon)).toBe(true);
    });

    it('2つ目のポリゴン内の点はtrueを返す', () => {
      expect(pointInGeometry(139.79, 35.69, multiPolygon)).toBe(true);
    });

    it('どちらのポリゴンにも含まれない点はfalseを返す', () => {
      expect(pointInGeometry(139.75, 35.69, multiPolygon)).toBe(false);
    });
  });

  describe('エッジケース', () => {
    const triangle = {
      type: 'Polygon' as const,
      coordinates: [
        [
          [0, 0],
          [10, 0],
          [5, 10],
          [0, 0],
        ],
      ],
    };

    it('三角形の中心付近はtrue', () => {
      expect(pointInGeometry(5, 3, triangle)).toBe(true);
    });

    it('三角形の外側はfalse', () => {
      expect(pointInGeometry(0, 10, triangle)).toBe(false);
    });

    it('負の座標でも動作する', () => {
      const negativePolygon = {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-10, -10],
            [10, -10],
            [10, 10],
            [-10, 10],
            [-10, -10],
          ],
        ],
      };
      expect(pointInGeometry(0, 0, negativePolygon)).toBe(true);
      expect(pointInGeometry(-5, -5, negativePolygon)).toBe(true);
      expect(pointInGeometry(-15, 0, negativePolygon)).toBe(false);
    });
  });
});
