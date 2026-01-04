/**
 * helpers.ts のテスト
 */

import {
  getVisitStatus,
  getVisitStatusIcon,
  getVisitStatusLabel,
  calculateDistance,
  filterMachiByName,
  sortMachiByName,
  isValidMachiId,
} from '../helpers';
import type { MachiRow } from '@/shared/types/database.types';

describe('machi/helpers', () => {
  describe('getVisitStatus', () => {
    it('0回はunvisitedを返す', () => {
      expect(getVisitStatus(0)).toBe('unvisited');
    });

    it('1回はfirstを返す', () => {
      expect(getVisitStatus(1)).toBe('first');
    });

    it('2回はsecondを返す', () => {
      expect(getVisitStatus(2)).toBe('second');
    });

    it('3回以上はmultipleを返す', () => {
      expect(getVisitStatus(3)).toBe('multiple');
      expect(getVisitStatus(10)).toBe('multiple');
      expect(getVisitStatus(100)).toBe('multiple');
    });
  });

  describe('getVisitStatusIcon', () => {
    it('各ステータスに対応するアイコンを返す', () => {
      expect(getVisitStatusIcon('unvisited')).toBe('📍');
      expect(getVisitStatusIcon('first')).toBe('✅');
      expect(getVisitStatusIcon('second')).toBe('⭐️');
      expect(getVisitStatusIcon('multiple')).toBe('🏆');
    });
  });

  describe('getVisitStatusLabel', () => {
    it('各ステータスに対応するラベルを返す', () => {
      expect(getVisitStatusLabel('unvisited')).toBe('未訪問');
      expect(getVisitStatusLabel('first')).toBe('初訪問');
      expect(getVisitStatusLabel('second')).toBe('2回目');
      expect(getVisitStatusLabel('multiple')).toBe('複数回');
    });
  });

  describe('calculateDistance', () => {
    it('同じ地点は0kmを返す', () => {
      expect(calculateDistance(35.6812, 139.7671, 35.6812, 139.7671)).toBe(0);
    });

    it('東京駅から渋谷駅までの距離を計算（約6km）', () => {
      // 東京駅: 35.6812, 139.7671
      // 渋谷駅: 35.6580, 139.7016
      const distance = calculateDistance(35.6812, 139.7671, 35.658, 139.7016);
      // 約6km（5.5〜7kmの範囲）
      expect(distance).toBeGreaterThan(5);
      expect(distance).toBeLessThan(7);
    });

    it('東京から大阪までの距離を計算（約400km）', () => {
      // 東京駅: 35.6812, 139.7671
      // 大阪駅: 34.7024, 135.4959
      const distance = calculateDistance(35.6812, 139.7671, 34.7024, 135.4959);
      // 約400km
      expect(distance).toBeGreaterThan(380);
      expect(distance).toBeLessThan(420);
    });

    it('地球の反対側（約20000km）', () => {
      // 東京とブラジル（対蹠点付近）
      const distance = calculateDistance(35.6812, 139.7671, -23.5505, -46.6333);
      // 約18000km
      expect(distance).toBeGreaterThan(17000);
      expect(distance).toBeLessThan(19000);
    });

    it('小数点第2位まで丸められる', () => {
      const distance = calculateDistance(35.6812, 139.7671, 35.6813, 139.7672);
      expect(distance.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    });
  });

  describe('filterMachiByName', () => {
    const mockMachiList: MachiRow[] = [
      createMockMachi('1', '渋谷'),
      createMockMachi('2', '新宿'),
      createMockMachi('3', '池袋'),
      createMockMachi('4', '原宿'),
    ];

    it('名前に部分一致する街を返す', () => {
      const result = filterMachiByName(mockMachiList, '宿');
      expect(result.map((m) => m.name)).toEqual(['新宿', '原宿']);
    });

    it('大文字小文字を区別しない', () => {
      const machiWithAlphabet = [
        ...mockMachiList,
        createMockMachi('5', 'Shibuya'),
      ];
      const result = filterMachiByName(machiWithAlphabet, 'shibuya');
      expect(result.map((m) => m.name)).toContain('Shibuya');
    });

    it('空の検索語は全件返す', () => {
      expect(filterMachiByName(mockMachiList, '')).toEqual(mockMachiList);
      expect(filterMachiByName(mockMachiList, '   ')).toEqual(mockMachiList);
    });

    it('マッチしない場合は空配列を返す', () => {
      expect(filterMachiByName(mockMachiList, '銀座')).toEqual([]);
    });
  });

  describe('sortMachiByName', () => {
    it('名前順でソートする', () => {
      const mockMachiList: MachiRow[] = [
        createMockMachi('1', '渋谷'),
        createMockMachi('2', '池袋'),
        createMockMachi('3', '秋葉原'),
      ];
      const result = sortMachiByName(mockMachiList);
      // localeCompare('ja')を使用。漢字は読みがな順ではなく、
      // ロケールに基づく照合順序（部首・画数等）でソートされる。
      // 注意: 五十音順（あきはばら→いけぶくろ→しぶや）にはならない
      expect(result.map((m) => m.name)).toEqual(['秋葉原', '渋谷', '池袋']);
    });

    it('元の配列を変更しない', () => {
      const original: MachiRow[] = [
        createMockMachi('1', 'B'),
        createMockMachi('2', 'A'),
      ];
      const originalCopy = [...original];
      sortMachiByName(original);
      expect(original).toEqual(originalCopy);
    });

    it('空配列は空配列を返す', () => {
      expect(sortMachiByName([])).toEqual([]);
    });
  });

  describe('isValidMachiId', () => {
    it('正しい形式のIDはtrueを返す', () => {
      expect(isValidMachiId('sta_tokyo')).toBe(true);
      expect(isValidMachiId('sta_shibuya_109')).toBe(true);
      expect(isValidMachiId('sta_a1b2c3')).toBe(true);
    });

    it('sta_プレフィックスがないとfalse', () => {
      expect(isValidMachiId('tokyo')).toBe(false);
      expect(isValidMachiId('machi_tokyo')).toBe(false);
    });

    it('大文字を含むとfalse', () => {
      expect(isValidMachiId('sta_Tokyo')).toBe(false);
      expect(isValidMachiId('sta_SHIBUYA')).toBe(false);
    });

    it('特殊文字を含むとfalse', () => {
      expect(isValidMachiId('sta_tokyo-station')).toBe(false);
      expect(isValidMachiId('sta_tokyo.station')).toBe(false);
    });

    it('空文字列はfalse', () => {
      expect(isValidMachiId('')).toBe(false);
    });
  });
});

// ヘルパー関数
function createMockMachi(id: string, name: string): MachiRow {
  return {
    id: `sta_${id}`,
    name,
    name_kana: null,
    name_translations: null,
    prefecture_id: 'pref_tokyo',
    prefecture_name: '東京都',
    prefecture_name_translations: null,
    city_id: 'city_shibuya',
    city_name: '渋谷区',
    city_name_translations: null,
    latitude: 35.6812,
    longitude: 139.7671,
    osm_id: null,
    place_type: null,
    tile_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
