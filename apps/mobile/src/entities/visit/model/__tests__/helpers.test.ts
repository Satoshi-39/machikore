/**
 * visit/helpers.ts のテスト
 */

import {
  validateCreateVisitParams,
  formatVisitDate,
  getRelativeTime,
  sortVisitsByDate,
} from '../helpers';
import type { VisitRow } from '@/shared/types/database.types';

describe('visit/helpers', () => {
  describe('formatVisitDate', () => {
    it('デフォルトで日本語フォーマット（ja-JP）で日時を返す', () => {
      // JSTでも日をまたがない時間を使用
      const result = formatVisitDate('2025-06-15T06:30:00Z');
      expect(result).toContain('2025');
      expect(result).toContain('6');
      expect(result).toContain('15');
    });

    it('locale引数でen-USを指定すると英語フォーマットで返す', () => {
      const result = formatVisitDate('2025-06-15T06:30:00Z', 'en-US');
      expect(result).toContain('2025');
      expect(result).toContain('June');
      expect(result).toContain('15');
    });

    it('locale引数でzh-CNを指定すると中国語フォーマットで返す', () => {
      const result = formatVisitDate('2025-06-15T06:30:00Z', 'zh-CN');
      expect(result).toContain('2025');
      expect(result).toContain('6');
      expect(result).toContain('15');
    });

    it('夏の日付も正しくフォーマットされる', () => {
      // JSTでも日をまたがない時間を使用
      const result = formatVisitDate('2025-08-20T06:00:00Z');
      expect(result).toContain('2025');
      expect(result).toContain('8');
      expect(result).toContain('20');
    });
  });

  describe('validateCreateVisitParams', () => {
    it('有効なパラメータはvalidを返す', () => {
      const result = validateCreateVisitParams({
        userId: 'user-123',
        stationId: 'sta_tokyo',
      });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('userIdが空の場合はエラー', () => {
      const result = validateCreateVisitParams({
        userId: '',
        stationId: 'sta_tokyo',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('ユーザーIDが必要です');
    });

    it('userIdが空白のみの場合はエラー', () => {
      const result = validateCreateVisitParams({
        userId: '   ',
        stationId: 'sta_tokyo',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('ユーザーIDが必要です');
    });

    it('stationIdが空の場合はエラー', () => {
      const result = validateCreateVisitParams({
        userId: 'user-123',
        stationId: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('街IDが必要です');
    });

    it('visitedAtが有効な日付ならOK', () => {
      const result = validateCreateVisitParams({
        userId: 'user-123',
        stationId: 'sta_tokyo',
        visitedAt: '2024-01-01T10:00:00Z',
      });
      expect(result.valid).toBe(true);
    });

    it('visitedAtが無効な日付ならエラー', () => {
      const result = validateCreateVisitParams({
        userId: 'user-123',
        stationId: 'sta_tokyo',
        visitedAt: 'invalid-date',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('訪問日時が無効です');
    });

    it('visitedAtが未来の日付ならエラー', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const result = validateCreateVisitParams({
        userId: 'user-123',
        stationId: 'sta_tokyo',
        visitedAt: futureDate.toISOString(),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('訪問日時は現在より前である必要があります');
    });
  });

  describe('getRelativeTime', () => {
    it('1分未満は「たった今」を返す', () => {
      const now = new Date();
      expect(getRelativeTime(now.toISOString())).toBe('たった今');
    });

    it('5分前は「5分前」を返す', () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 5);
      expect(getRelativeTime(date.toISOString())).toBe('5分前');
    });

    it('3時間前は「3時間前」を返す', () => {
      const date = new Date();
      date.setHours(date.getHours() - 3);
      expect(getRelativeTime(date.toISOString())).toBe('3時間前');
    });

    it('2日前は「2日前」を返す', () => {
      const date = new Date();
      date.setDate(date.getDate() - 2);
      expect(getRelativeTime(date.toISOString())).toBe('2日前');
    });

    it('2週間前は「2週間前」を返す', () => {
      const date = new Date();
      date.setDate(date.getDate() - 14);
      expect(getRelativeTime(date.toISOString())).toBe('2週間前');
    });

    it('2ヶ月前は「2ヶ月前」を返す', () => {
      const date = new Date();
      date.setDate(date.getDate() - 60);
      expect(getRelativeTime(date.toISOString())).toBe('2ヶ月前');
    });

    it('1年前は「1年前」を返す', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      expect(getRelativeTime(date.toISOString())).toBe('1年前');
    });
  });

  describe('sortVisitsByDate', () => {
    it('新しい順にソートする', () => {
      const visits: VisitRow[] = [
        createMockVisit('1', '2024-01-01T10:00:00Z'),
        createMockVisit('2', '2024-01-03T10:00:00Z'),
        createMockVisit('3', '2024-01-02T10:00:00Z'),
      ];
      const sorted = sortVisitsByDate(visits);
      expect(sorted.map((v) => v.id)).toEqual(['2', '3', '1']);
    });

    it('元の配列を変更しない', () => {
      const original: VisitRow[] = [
        createMockVisit('1', '2024-01-01T10:00:00Z'),
        createMockVisit('2', '2024-01-02T10:00:00Z'),
      ];
      const originalCopy = [...original];
      sortVisitsByDate(original);
      expect(original).toEqual(originalCopy);
    });

    it('空配列は空配列を返す', () => {
      expect(sortVisitsByDate([])).toEqual([]);
    });
  });
});

function createMockVisit(id: string, visitedAt: string): VisitRow {
  return {
    id,
    user_id: 'user-123',
    machi_id: 'sta_tokyo',
    visited_at: visitedAt,
    created_at: visitedAt,
    updated_at: visitedAt,
  };
}
