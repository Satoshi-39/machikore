/**
 * insertAdsIntoList のテスト
 *
 * プレミアムユーザーは広告なし、無料ユーザーは広告ありの動作を検証
 */

import { insertAdsIntoList } from '../insertAdsIntoList';

describe('insertAdsIntoList', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f'];

  describe('showAds=false（プレミアム）', () => {
    it('広告が一切挿入されない', () => {
      const result = insertAdsIntoList(items, 3, false);

      expect(result).toHaveLength(items.length);
      expect(result.every((item) => item.type === 'content')).toBe(true);
    });

    it('元データがそのまま保持される', () => {
      const result = insertAdsIntoList(items, 3, false);

      const contentItems = result.filter((item) => item.type === 'content');
      contentItems.forEach((item, i) => {
        if (item.type === 'content') {
          expect(item.data).toBe(items[i]);
        }
      });
    });
  });

  describe('showAds=true（無料・デフォルト）', () => {
    it('interval件ごとに広告が挿入される', () => {
      const result = insertAdsIntoList(items, 3, true);

      // [a, b, c, ad, d, e, f] — 最後の3件目の後は末尾なので広告なし
      expect(result).toHaveLength(7);
      expect(result[3]).toEqual({ type: 'ad', id: 'ad-2' });
    });

    it('デフォルトでshowAds=trueとして動作する', () => {
      const result = insertAdsIntoList(items, 3);

      const adItems = result.filter((item) => item.type === 'ad');
      expect(adItems.length).toBeGreaterThan(0);
    });

    it('最後のアイテムの後には広告を挿入しない', () => {
      // 3件でinterval=3 → ちょうど最後なので広告なし
      const result = insertAdsIntoList(['a', 'b', 'c'], 3);

      expect(result).toHaveLength(3);
      expect(result.every((item) => item.type === 'content')).toBe(true);
    });

    it('interval=5で6件の場合、5件目の後に広告が入る', () => {
      const result = insertAdsIntoList(items, 5);

      // [a, b, c, d, e, ad, f]
      expect(result).toHaveLength(7);
      expect(result[5]).toEqual({ type: 'ad', id: 'ad-4' });
    });
  });

  describe('エッジケース', () => {
    it('空配列の場合は空配列を返す', () => {
      expect(insertAdsIntoList([], 5, true)).toEqual([]);
      expect(insertAdsIntoList([], 5, false)).toEqual([]);
    });

    it('1件のみの場合は広告なし', () => {
      const result = insertAdsIntoList(['a'], 1, true);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ type: 'content', data: 'a' });
    });
  });
});
