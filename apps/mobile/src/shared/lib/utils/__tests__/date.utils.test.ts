/**
 * date.utils.ts のテスト
 */

import {
  formatDateKey,
  formatLocalDateKey,
  isSameDay,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '../date.utils';

describe('date.utils', () => {
  describe('formatDateKey', () => {
    it('Date を YYYY-MM-DD 形式に変換する（UTC）', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      expect(formatDateKey(date)).toBe('2025-01-15');
    });

    it('月・日が1桁の場合もゼロ埋めされる', () => {
      const date = new Date('2025-03-05T00:00:00Z');
      expect(formatDateKey(date)).toBe('2025-03-05');
    });
  });

  describe('formatLocalDateKey', () => {
    it('Date を YYYY-MM-DD 形式に変換する（ローカル）', () => {
      const date = new Date(2025, 0, 15); // 2025年1月15日
      expect(formatLocalDateKey(date)).toBe('2025-01-15');
    });

    it('月・日が1桁の場合もゼロ埋めされる', () => {
      const date = new Date(2025, 2, 5); // 2025年3月5日
      expect(formatLocalDateKey(date)).toBe('2025-03-05');
    });

    it('12月も正しく処理される', () => {
      const date = new Date(2025, 11, 31); // 2025年12月31日
      expect(formatLocalDateKey(date)).toBe('2025-12-31');
    });
  });

  describe('isSameDay', () => {
    it('同じ日付ならtrueを返す', () => {
      const date1 = new Date(2025, 0, 15, 10, 30);
      const date2 = new Date(2025, 0, 15, 23, 59);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('異なる日付ならfalseを返す', () => {
      const date1 = new Date(2025, 0, 15);
      const date2 = new Date(2025, 0, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('異なる月ならfalseを返す', () => {
      const date1 = new Date(2025, 0, 15);
      const date2 = new Date(2025, 1, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('異なる年ならfalseを返す', () => {
      const date1 = new Date(2025, 0, 15);
      const date2 = new Date(2024, 0, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('1月は31日', () => {
      expect(getDaysInMonth(2025, 0)).toBe(31);
    });

    it('4月は30日', () => {
      expect(getDaysInMonth(2025, 3)).toBe(30);
    });

    it('2月（平年）は28日', () => {
      expect(getDaysInMonth(2025, 1)).toBe(28);
    });

    it('2月（うるう年）は29日', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('12月は31日', () => {
      expect(getDaysInMonth(2025, 11)).toBe(31);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('2025年1月1日は水曜日（3）', () => {
      expect(getFirstDayOfMonth(2025, 0)).toBe(3);
    });

    it('2025年2月1日は土曜日（6）', () => {
      expect(getFirstDayOfMonth(2025, 1)).toBe(6);
    });

    it('2025年3月1日は土曜日（6）', () => {
      expect(getFirstDayOfMonth(2025, 2)).toBe(6);
    });
  });
});
