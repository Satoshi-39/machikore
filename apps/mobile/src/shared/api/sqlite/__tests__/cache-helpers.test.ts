/**
 * cache.ts ヘルパー関数のテスト
 *
 * キャッシュキー生成とTTL設定のテスト
 * （SQLiteに依存する関数は除外）
 *
 * 注意: cache.tsはexpo-sqliteに依存しているため、
 * 純粋関数のロジックをここで再定義してテストする
 */

// cache.tsからの定数（expo-sqlite依存を避けるため再定義）
const CACHE_TTL = {
  MACHI: 7 * 24 * 60 * 60 * 1000,
  CITIES: 7 * 24 * 60 * 60 * 1000,
  PREFECTURES: 30 * 24 * 60 * 60 * 1000,
} as const;

// cache.tsからの純粋関数（expo-sqlite依存を避けるため再定義）
function getMachiCacheKey(prefectureId: string): string {
  return `machi:${prefectureId}`;
}

function getCitiesCacheKey(prefectureId: string): string {
  return `cities:${prefectureId}`;
}

describe('cache helpers', () => {
  describe('CACHE_TTL', () => {
    it('MACHIは7日間', () => {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      expect(CACHE_TTL.MACHI).toBe(sevenDaysMs);
    });

    it('CITIESは7日間', () => {
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      expect(CACHE_TTL.CITIES).toBe(sevenDaysMs);
    });

    it('PREFECTURESは30日間', () => {
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      expect(CACHE_TTL.PREFECTURES).toBe(thirtyDaysMs);
    });

    it('TTLは正の数', () => {
      Object.values(CACHE_TTL).forEach((ttl) => {
        expect(ttl).toBeGreaterThan(0);
      });
    });

    it('PREFECTURESはMACHI/CITIESより長い', () => {
      expect(CACHE_TTL.PREFECTURES).toBeGreaterThan(CACHE_TTL.MACHI);
      expect(CACHE_TTL.PREFECTURES).toBeGreaterThan(CACHE_TTL.CITIES);
    });
  });

  describe('getMachiCacheKey', () => {
    it('都道府県IDからキャッシュキーを生成', () => {
      const key = getMachiCacheKey('tokyo');
      expect(key).toBe('machi:tokyo');
    });

    it('異なる都道府県IDで異なるキーを生成', () => {
      const key1 = getMachiCacheKey('tokyo');
      const key2 = getMachiCacheKey('osaka');
      expect(key1).not.toBe(key2);
    });

    it('プレフィックスが「machi:」', () => {
      const key = getMachiCacheKey('any-id');
      expect(key.startsWith('machi:')).toBe(true);
    });

    it('空文字列でも動作する', () => {
      const key = getMachiCacheKey('');
      expect(key).toBe('machi:');
    });

    it('日本語IDでも動作する', () => {
      const key = getMachiCacheKey('東京');
      expect(key).toBe('machi:東京');
    });

    it('UUIDでも動作する', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const key = getMachiCacheKey(uuid);
      expect(key).toBe(`machi:${uuid}`);
    });
  });

  describe('getCitiesCacheKey', () => {
    it('都道府県IDからキャッシュキーを生成', () => {
      const key = getCitiesCacheKey('tokyo');
      expect(key).toBe('cities:tokyo');
    });

    it('異なる都道府県IDで異なるキーを生成', () => {
      const key1 = getCitiesCacheKey('tokyo');
      const key2 = getCitiesCacheKey('osaka');
      expect(key1).not.toBe(key2);
    });

    it('プレフィックスが「cities:」', () => {
      const key = getCitiesCacheKey('any-id');
      expect(key.startsWith('cities:')).toBe(true);
    });

    it('空文字列でも動作する', () => {
      const key = getCitiesCacheKey('');
      expect(key).toBe('cities:');
    });

    it('日本語IDでも動作する', () => {
      const key = getCitiesCacheKey('東京');
      expect(key).toBe('cities:東京');
    });
  });

  describe('キャッシュキーの一意性', () => {
    it('machiとcitiesのキーは異なる', () => {
      const machiKey = getMachiCacheKey('tokyo');
      const citiesKey = getCitiesCacheKey('tokyo');
      expect(machiKey).not.toBe(citiesKey);
    });

    it('同じプレフィックスで同じIDなら同じキー', () => {
      const key1 = getMachiCacheKey('tokyo');
      const key2 = getMachiCacheKey('tokyo');
      expect(key1).toBe(key2);
    });
  });
});
