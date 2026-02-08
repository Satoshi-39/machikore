/**
 * categories.ts のテスト
 */

import {
  MAP_CATEGORIES,
  getCategoryOption,
  type MapCategory,
  type CategoryOption,
} from '../categories';

describe('categories', () => {
  describe('MAP_CATEGORIES', () => {
    it('6つのカテゴリが定義されている', () => {
      expect(MAP_CATEGORIES).toHaveLength(6);
    });

    it('各カテゴリにvalue, labelKey, iconが設定されている', () => {
      MAP_CATEGORIES.forEach((category) => {
        expect(category.value).toBeDefined();
        expect(category.labelKey).toBeDefined();
        expect(category.icon).toBeDefined();
      });
    });

    it('旅行カテゴリが含まれている', () => {
      const travel = MAP_CATEGORIES.find((c) => c.value === '旅行');
      expect(travel).toBeDefined();
      expect(travel?.icon).toBe('airplane');
    });

    it('グルメカテゴリが含まれている', () => {
      const gourmet = MAP_CATEGORIES.find((c) => c.value === 'グルメ');
      expect(gourmet).toBeDefined();
      expect(gourmet?.icon).toBe('restaurant');
    });

    it('観光カテゴリが含まれている', () => {
      const sightseeing = MAP_CATEGORIES.find((c) => c.value === '観光');
      expect(sightseeing).toBeDefined();
      expect(sightseeing?.icon).toBe('camera');
    });

    it('ショッピングカテゴリが含まれている', () => {
      const shopping = MAP_CATEGORIES.find((c) => c.value === 'ショッピング');
      expect(shopping).toBeDefined();
      expect(shopping?.icon).toBe('cart');
    });

    it('アクティビティカテゴリが含まれている', () => {
      const activity = MAP_CATEGORIES.find((c) => c.value === 'アクティビティ');
      expect(activity).toBeDefined();
      expect(activity?.icon).toBe('bicycle');
    });

    it('その他カテゴリが含まれている', () => {
      const other = MAP_CATEGORIES.find((c) => c.value === 'その他');
      expect(other).toBeDefined();
      expect(other?.icon).toBe('ellipsis-horizontal');
    });

    it('各カテゴリにlabelKeyが設定されている', () => {
      MAP_CATEGORIES.forEach((category) => {
        expect(category.labelKey).toMatch(/^mapCategory\./);
      });
    });

    it('重複するvalueがない', () => {
      const values = MAP_CATEGORIES.map((c) => c.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('getCategoryOption', () => {
    it('有効なカテゴリ値でオプションを取得できる', () => {
      const option = getCategoryOption('旅行');
      expect(option).toBeDefined();
      expect(option?.value).toBe('旅行');
      expect(option?.icon).toBe('airplane');
    });

    it('グルメカテゴリを取得できる', () => {
      const option = getCategoryOption('グルメ');
      expect(option).toBeDefined();
      expect(option?.value).toBe('グルメ');
    });

    it('観光カテゴリを取得できる', () => {
      const option = getCategoryOption('観光');
      expect(option).toBeDefined();
      expect(option?.value).toBe('観光');
    });

    it('nullの場合undefinedを返す', () => {
      const option = getCategoryOption(null);
      expect(option).toBeUndefined();
    });

    it('undefinedの場合undefinedを返す', () => {
      const option = getCategoryOption(undefined);
      expect(option).toBeUndefined();
    });

    it('存在しないカテゴリの場合undefinedを返す', () => {
      const option = getCategoryOption('存在しないカテゴリ');
      expect(option).toBeUndefined();
    });

    it('空文字列の場合undefinedを返す', () => {
      const option = getCategoryOption('');
      expect(option).toBeUndefined();
    });

    it('すべてのカテゴリを取得できる', () => {
      const categoryValues: MapCategory[] = [
        '旅行',
        'グルメ',
        '観光',
        'ショッピング',
        'アクティビティ',
        'その他',
      ];

      categoryValues.forEach((value) => {
        const option = getCategoryOption(value);
        expect(option).toBeDefined();
        expect(option?.value).toBe(value);
      });
    });

    it('返り値はCategoryOption型に適合する', () => {
      const option = getCategoryOption('旅行') as CategoryOption;
      expect(typeof option.value).toBe('string');
      expect(typeof option.labelKey).toBe('string');
      expect(typeof option.icon).toBe('string');
    });
  });
});
