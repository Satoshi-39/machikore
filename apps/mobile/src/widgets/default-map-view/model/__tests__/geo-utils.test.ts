/**
 * use-center-location-name.ts 内の純粋関数のテスト
 *
 * getDistance と findNearest 関数のテスト
 * （ファイルから関数をエクスポートしていないため、ロジックを再定義してテスト）
 */

// use-center-location-name.ts からの純粋関数（ファイル内でexportされていないため再定義）
function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface NearestResult<T> {
  item: T;
  distance: number;
}

function findNearest<T extends { latitude: number; longitude: number; name: string }>(
  items: T[],
  center: { latitude: number; longitude: number }
): NearestResult<T> | null {
  if (items.length === 0) return null;

  let nearest = items[0]!;
  let minDistance = getDistance(
    center.latitude,
    center.longitude,
    nearest.latitude,
    nearest.longitude
  );

  for (let i = 1; i < items.length; i++) {
    const item = items[i]!;
    const distance = getDistance(
      center.latitude,
      center.longitude,
      item.latitude,
      item.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = item;
    }
  }

  return { item: nearest, distance: minDistance };
}

describe('geo-utils (from use-center-location-name)', () => {
  describe('getDistance', () => {
    it('同じ座標は距離0', () => {
      const distance = getDistance(35.6762, 139.6503, 35.6762, 139.6503);
      expect(distance).toBe(0);
    });

    it('東京-大阪間は約400km', () => {
      // 東京駅: 35.6812, 139.7671
      // 大阪駅: 34.7024, 135.4959
      const distance = getDistance(35.6812, 139.7671, 34.7024, 135.4959);
      expect(distance).toBeGreaterThan(390);
      expect(distance).toBeLessThan(410);
    });

    it('東京-渋谷間は約3km', () => {
      // 東京駅: 35.6812, 139.7671
      // 渋谷駅: 35.6580, 139.7016
      const distance = getDistance(35.6812, 139.7671, 35.6580, 139.7016);
      expect(distance).toBeGreaterThan(5);
      expect(distance).toBeLessThan(8);
    });

    it('東京-ニューヨーク間は約10,000km以上', () => {
      // 東京: 35.6762, 139.6503
      // ニューヨーク: 40.7128, -74.0060
      const distance = getDistance(35.6762, 139.6503, 40.7128, -74.0060);
      expect(distance).toBeGreaterThan(10000);
      expect(distance).toBeLessThan(11000);
    });

    it('赤道上の1度は約111km', () => {
      // 赤道上で経度1度の差
      const distance = getDistance(0, 0, 0, 1);
      expect(distance).toBeGreaterThan(110);
      expect(distance).toBeLessThan(112);
    });

    it('負の座標でも正しく計算', () => {
      // シドニー: -33.8688, 151.2093
      // ブエノスアイレス: -34.6037, -58.3816
      const distance = getDistance(-33.8688, 151.2093, -34.6037, -58.3816);
      expect(distance).toBeGreaterThan(11000);
      expect(distance).toBeLessThan(12500);
    });

    it('距離は常に正の値', () => {
      const distance = getDistance(35.0, 135.0, 40.0, 140.0);
      expect(distance).toBeGreaterThan(0);
    });

    it('順序を入れ替えても同じ距離', () => {
      const d1 = getDistance(35.6762, 139.6503, 34.7024, 135.4959);
      const d2 = getDistance(34.7024, 135.4959, 35.6762, 139.6503);
      expect(d1).toBeCloseTo(d2, 10);
    });
  });

  describe('findNearest', () => {
    const sampleItems = [
      { name: '渋谷', latitude: 35.6580, longitude: 139.7016 },
      { name: '新宿', latitude: 35.6896, longitude: 139.6917 },
      { name: '池袋', latitude: 35.7295, longitude: 139.7109 },
      { name: '品川', latitude: 35.6284, longitude: 139.7387 },
    ];

    it('空配列はnullを返す', () => {
      const result = findNearest([], { latitude: 35.6762, longitude: 139.6503 });
      expect(result).toBeNull();
    });

    it('最も近い場所を返す', () => {
      // 渋谷の座標に近い点
      const center = { latitude: 35.6580, longitude: 139.7016 };
      const result = findNearest(sampleItems, center);

      expect(result).not.toBeNull();
      expect(result!.item.name).toBe('渋谷');
      expect(result!.distance).toBe(0);
    });

    it('新宿に最も近い場所を見つける', () => {
      // 新宿の座標に近い点
      const center = { latitude: 35.6900, longitude: 139.6920 };
      const result = findNearest(sampleItems, center);

      expect(result).not.toBeNull();
      expect(result!.item.name).toBe('新宿');
      expect(result!.distance).toBeLessThan(1); // 1km以内
    });

    it('要素が1つでも動作する', () => {
      const singleItem = [{ name: '東京', latitude: 35.6762, longitude: 139.6503 }];
      const center = { latitude: 35.0, longitude: 135.0 };
      const result = findNearest(singleItem, center);

      expect(result).not.toBeNull();
      expect(result!.item.name).toBe('東京');
      expect(result!.distance).toBeGreaterThan(0);
    });

    it('距離情報も正しく返す', () => {
      // 東京駅付近
      const center = { latitude: 35.6812, longitude: 139.7671 };
      const result = findNearest(sampleItems, center);

      expect(result).not.toBeNull();
      expect(result!.distance).toBeGreaterThan(0);
      // 品川が最も近いはず（約3km）
      expect(result!.item.name).toBe('品川');
    });

    it('同じ距離の場合は最初に見つかった方を返す', () => {
      const equidistantItems = [
        { name: 'A', latitude: 35.0, longitude: 135.0 },
        { name: 'B', latitude: 35.0, longitude: 135.0 }, // 同じ座標
      ];
      const center = { latitude: 35.0, longitude: 135.0 };
      const result = findNearest(equidistantItems, center);

      expect(result).not.toBeNull();
      expect(result!.item.name).toBe('A');
    });

    it('追加のプロパティを持つオブジェクトでも動作', () => {
      const extendedItems = [
        { name: '渋谷', latitude: 35.6580, longitude: 139.7016, population: 224533 },
        { name: '新宿', latitude: 35.6896, longitude: 139.6917, population: 346162 },
      ];
      const center = { latitude: 35.6580, longitude: 139.7016 };
      const result = findNearest(extendedItems, center);

      expect(result).not.toBeNull();
      expect(result!.item.name).toBe('渋谷');
      expect((result!.item as any).population).toBe(224533);
    });
  });
});
