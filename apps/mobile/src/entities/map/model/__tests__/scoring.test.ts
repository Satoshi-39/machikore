/**
 * scoring.ts のテスト
 */

import {
  getRecencyScore,
  calculatePopularityScore,
  countByMapId,
  getTopMapIds,
} from '../scoring';

describe('map/scoring', () => {
  describe('getRecencyScore', () => {
    it('30日以内は1.0を返す', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7日前
      expect(getRecencyScore(recent.toISOString())).toBe(1.0);
    });

    it('ちょうど今日は1.0を返す', () => {
      const now = new Date();
      expect(getRecencyScore(now.toISOString())).toBe(1.0);
    });

    it('31日前は0.5を返す', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
      expect(getRecencyScore(oldDate.toISOString())).toBe(0.5);
    });

    it('90日前は0.5を返す', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      expect(getRecencyScore(oldDate.toISOString())).toBe(0.5);
    });

    it('91日以上前は0.2を返す', () => {
      const now = new Date();
      const veryOld = new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000);
      expect(getRecencyScore(veryOld.toISOString())).toBe(0.2);
    });

    it('1年前は0.2を返す', () => {
      const now = new Date();
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      expect(getRecencyScore(oneYearAgo.toISOString())).toBe(0.2);
    });
  });

  describe('calculatePopularityScore', () => {
    it('いいね・閲覧・鮮度スコアを正しく計算する', () => {
      const now = new Date();
      // 今日作成: recencyScore = 1.0
      // score = 10 * 0.4 + 100 * 0.3 + 1.0 * 30 = 4 + 30 + 30 = 64
      const score = calculatePopularityScore(10, 100, now.toISOString());
      expect(score).toBe(64);
    });

    it('いいね0、閲覧0でも鮮度スコアは加算される', () => {
      const now = new Date();
      const score = calculatePopularityScore(0, 0, now.toISOString());
      // score = 0 * 0.4 + 0 * 0.3 + 1.0 * 30 = 30
      expect(score).toBe(30);
    });

    it('古い投稿は鮮度スコアが低い', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000);
      // score = 10 * 0.4 + 100 * 0.3 + 0.2 * 30 = 4 + 30 + 6 = 40
      const score = calculatePopularityScore(10, 100, oldDate.toISOString());
      expect(score).toBe(40);
    });

    it('いいね数が多いと高スコア', () => {
      const now = new Date();
      const lowLikes = calculatePopularityScore(10, 100, now.toISOString());
      const highLikes = calculatePopularityScore(100, 100, now.toISOString());
      expect(highLikes).toBeGreaterThan(lowLikes);
    });
  });

  describe('countByMapId', () => {
    it('map_idごとにカウントする', () => {
      const items = [
        { map_id: 'map1' },
        { map_id: 'map1' },
        { map_id: 'map2' },
        { map_id: 'map1' },
        { map_id: 'map2' },
      ];
      const counts = countByMapId(items);
      expect(counts).toEqual({ map1: 3, map2: 2 });
    });

    it('空配列は空オブジェクトを返す', () => {
      expect(countByMapId([])).toEqual({});
    });

    it('map_idがnullの項目は無視する', () => {
      const items = [
        { map_id: 'map1' },
        { map_id: null },
        { map_id: 'map1' },
      ];
      const counts = countByMapId(items);
      expect(counts).toEqual({ map1: 2 });
    });

    it('すべてnullなら空オブジェクト', () => {
      const items = [{ map_id: null }, { map_id: null }];
      const counts = countByMapId(items);
      expect(counts).toEqual({});
    });
  });

  describe('getTopMapIds', () => {
    it('カウント降順で上位N件を返す', () => {
      const counts = { map1: 10, map2: 50, map3: 30, map4: 5 };
      expect(getTopMapIds(counts, 2)).toEqual(['map2', 'map3']);
      expect(getTopMapIds(counts, 3)).toEqual(['map2', 'map3', 'map1']);
    });

    it('limitが件数より多い場合は全件返す', () => {
      const counts = { map1: 10, map2: 20 };
      expect(getTopMapIds(counts, 10)).toEqual(['map2', 'map1']);
    });

    it('空オブジェクトは空配列を返す', () => {
      expect(getTopMapIds({}, 5)).toEqual([]);
    });

    it('limit=0は空配列を返す', () => {
      const counts = { map1: 10, map2: 20 };
      expect(getTopMapIds(counts, 0)).toEqual([]);
    });

    it('同じカウントの場合も正しく処理する', () => {
      const counts = { map1: 10, map2: 10, map3: 10 };
      const result = getTopMapIds(counts, 2);
      expect(result.length).toBe(2);
    });
  });
});
