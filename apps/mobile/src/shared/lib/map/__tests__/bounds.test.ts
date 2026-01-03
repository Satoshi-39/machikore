/**
 * bounds.ts のテスト
 *
 * マップ境界計算ユーティリティのテスト
 */

import { calculateBoundsFromCamera } from '../bounds';

describe('bounds', () => {
  describe('calculateBoundsFromCamera', () => {
    it('ズームレベル0で全世界の範囲を返す', () => {
      const result = calculateBoundsFromCamera({ lat: 0, lng: 0 }, 0);

      // ズーム0: latDelta = 180, lngDelta = 360
      expect(result.minLat).toBe(-180);
      expect(result.maxLat).toBe(180);
      expect(result.minLng).toBe(-360);
      expect(result.maxLng).toBe(360);
    });

    it('ズームレベル1で範囲が半分になる', () => {
      const result = calculateBoundsFromCamera({ lat: 0, lng: 0 }, 1);

      // ズーム1: latDelta = 90, lngDelta = 180
      expect(result.minLat).toBe(-90);
      expect(result.maxLat).toBe(90);
      expect(result.minLng).toBe(-180);
      expect(result.maxLng).toBe(180);
    });

    it('ズームレベル2で範囲がさらに半分になる', () => {
      const result = calculateBoundsFromCamera({ lat: 0, lng: 0 }, 2);

      // ズーム2: latDelta = 45, lngDelta = 90
      expect(result.minLat).toBe(-45);
      expect(result.maxLat).toBe(45);
      expect(result.minLng).toBe(-90);
      expect(result.maxLng).toBe(90);
    });

    it('東京中心でズームレベル10の境界を計算', () => {
      const tokyo = { lat: 35.6762, lng: 139.6503 };
      const result = calculateBoundsFromCamera(tokyo, 10);

      // ズーム10: latDelta = 180/1024 ≈ 0.176, lngDelta = 360/1024 ≈ 0.352
      const expectedLatDelta = 180 / Math.pow(2, 10);
      const expectedLngDelta = 360 / Math.pow(2, 10);

      expect(result.minLat).toBeCloseTo(tokyo.lat - expectedLatDelta, 5);
      expect(result.maxLat).toBeCloseTo(tokyo.lat + expectedLatDelta, 5);
      expect(result.minLng).toBeCloseTo(tokyo.lng - expectedLngDelta, 5);
      expect(result.maxLng).toBeCloseTo(tokyo.lng + expectedLngDelta, 5);
    });

    it('高ズームレベル（15）では非常に狭い範囲', () => {
      const shibuya = { lat: 35.6580, lng: 139.7016 };
      const result = calculateBoundsFromCamera(shibuya, 15);

      // ズーム15: latDelta ≈ 0.0055, lngDelta ≈ 0.011
      const latDelta = 180 / Math.pow(2, 15);
      const lngDelta = 360 / Math.pow(2, 15);

      // 範囲が非常に小さいことを確認
      expect(result.maxLat - result.minLat).toBeCloseTo(latDelta * 2, 5);
      expect(result.maxLng - result.minLng).toBeCloseTo(lngDelta * 2, 5);
    });

    it('負の緯度・経度でも正しく計算', () => {
      const sydney = { lat: -33.8688, lng: 151.2093 };
      const result = calculateBoundsFromCamera(sydney, 10);

      expect(result.minLat).toBeLessThan(sydney.lat);
      expect(result.maxLat).toBeGreaterThan(sydney.lat);
      expect(result.minLng).toBeLessThan(sydney.lng);
      expect(result.maxLng).toBeGreaterThan(sydney.lng);
    });

    it('西半球（負の経度）でも正しく計算', () => {
      const newYork = { lat: 40.7128, lng: -74.0060 };
      const result = calculateBoundsFromCamera(newYork, 10);

      expect(result.minLat).toBeLessThan(newYork.lat);
      expect(result.maxLat).toBeGreaterThan(newYork.lat);
      expect(result.minLng).toBeLessThan(newYork.lng);
      expect(result.maxLng).toBeGreaterThan(newYork.lng);
    });

    it('中心座標が境界の中心にある', () => {
      const center = { lat: 35.0, lng: 135.0 };
      const result = calculateBoundsFromCamera(center, 8);

      const calculatedCenterLat = (result.minLat + result.maxLat) / 2;
      const calculatedCenterLng = (result.minLng + result.maxLng) / 2;

      expect(calculatedCenterLat).toBeCloseTo(center.lat, 10);
      expect(calculatedCenterLng).toBeCloseTo(center.lng, 10);
    });

    it('ズームレベルが上がるほど範囲が狭くなる', () => {
      const center = { lat: 35.0, lng: 135.0 };

      const zoom5 = calculateBoundsFromCamera(center, 5);
      const zoom10 = calculateBoundsFromCamera(center, 10);
      const zoom15 = calculateBoundsFromCamera(center, 15);

      const range5 = zoom5.maxLat - zoom5.minLat;
      const range10 = zoom10.maxLat - zoom10.minLat;
      const range15 = zoom15.maxLat - zoom15.minLat;

      expect(range5).toBeGreaterThan(range10);
      expect(range10).toBeGreaterThan(range15);
    });

    it('小数点のズームレベルでも計算可能', () => {
      const center = { lat: 35.0, lng: 135.0 };
      const result = calculateBoundsFromCamera(center, 10.5);

      expect(result.minLat).toBeDefined();
      expect(result.maxLat).toBeDefined();
      expect(result.minLng).toBeDefined();
      expect(result.maxLng).toBeDefined();
      expect(result.maxLat).toBeGreaterThan(result.minLat);
    });
  });
});
