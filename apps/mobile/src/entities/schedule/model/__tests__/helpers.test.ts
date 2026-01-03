/**
 * schedule/helpers.ts のテスト
 */

import {
  validateCreateScheduleParams,
  formatScheduleDate,
  formatScheduleDateShort,
  getScheduleDateOnly,
  isToday,
  isPast,
  isFuture,
  sortSchedulesByDate,
  filterCompletedSchedules,
  filterIncompleteSchedules,
} from '../helpers';
import type { ScheduleRow } from '@/shared/types/database.types';

describe('schedule/helpers', () => {
  describe('formatScheduleDate', () => {
    it('デフォルトで日本語フォーマット（ja-JP）で日時を返す', () => {
      // JSTでも日をまたがない時間を使用
      const result = formatScheduleDate('2025-06-15T06:30:00Z');
      expect(result).toContain('2025');
      expect(result).toContain('6');
      expect(result).toContain('15');
    });

    it('locale引数でen-USを指定すると英語フォーマットで返す', () => {
      const result = formatScheduleDate('2025-06-15T06:30:00Z', 'en-US');
      expect(result).toContain('2025');
      expect(result).toContain('June');
      expect(result).toContain('15');
    });

    it('locale引数でzh-CNを指定すると中国語フォーマットで返す', () => {
      const result = formatScheduleDate('2025-06-15T06:30:00Z', 'zh-CN');
      expect(result).toContain('2025');
      expect(result).toContain('6');
      expect(result).toContain('15');
    });
  });

  describe('formatScheduleDateShort', () => {
    it('デフォルトで日本語短縮フォーマットで日時を返す', () => {
      // JSTでも日をまたがない時間を使用
      const result = formatScheduleDateShort('2025-06-15T06:30:00Z');
      expect(result).toContain('6');
      expect(result).toContain('15');
    });

    it('locale引数でen-USを指定すると英語短縮フォーマットで返す', () => {
      const result = formatScheduleDateShort('2025-06-15T06:30:00Z', 'en-US');
      expect(result).toContain('Jun');
      expect(result).toContain('15');
    });
  });

  describe('validateCreateScheduleParams', () => {
    const validParams = {
      userId: 'user-123',
      stationId: 'sta_tokyo',
      title: 'テスト予定',
      scheduledAt: '2025-01-15T10:00:00Z',
    };

    it('有効なパラメータはvalidを返す', () => {
      const result = validateCreateScheduleParams(validParams);
      expect(result.valid).toBe(true);
    });

    it('userIdが空ならエラー', () => {
      const result = validateCreateScheduleParams({
        ...validParams,
        userId: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('ユーザーIDが必要です');
    });

    it('stationIdが空ならエラー', () => {
      const result = validateCreateScheduleParams({
        ...validParams,
        stationId: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('街IDが必要です');
    });

    it('titleが空ならエラー', () => {
      const result = validateCreateScheduleParams({
        ...validParams,
        title: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('タイトルが必要です');
    });

    it('titleが100文字を超えるとエラー', () => {
      const result = validateCreateScheduleParams({
        ...validParams,
        title: 'a'.repeat(101),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('タイトルは100文字以内にしてください');
    });

    it('titleが100文字ちょうどはOK', () => {
      const result = validateCreateScheduleParams({
        ...validParams,
        title: 'a'.repeat(100),
      });
      expect(result.valid).toBe(true);
    });

    it('scheduledAtが無効な日付ならエラー', () => {
      const result = validateCreateScheduleParams({
        ...validParams,
        scheduledAt: 'invalid-date',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('予定日時が無効です');
    });
  });

  describe('getScheduleDateOnly', () => {
    it('ISO文字列から日付部分のみ抽出する', () => {
      expect(getScheduleDateOnly('2025-01-15T10:30:00Z')).toBe('2025-01-15');
    });

    it('日付のみの文字列はそのまま返す', () => {
      expect(getScheduleDateOnly('2025-01-15')).toBe('2025-01-15');
    });

    it('Tを含まない文字列はそのまま返す', () => {
      expect(getScheduleDateOnly('2025-01-15 10:30:00')).toBe('2025-01-15 10:30:00');
    });
  });

  describe('isToday', () => {
    it('今日の日付はtrueを返す', () => {
      const today = new Date();
      expect(isToday(today.toISOString())).toBe(true);
    });

    it('昨日の日付はfalseを返す', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday.toISOString())).toBe(false);
    });

    it('明日の日付はfalseを返す', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow.toISOString())).toBe(false);
    });

    it('今日の別時刻もtrueを返す', () => {
      const today = new Date();
      today.setHours(23, 59, 59);
      expect(isToday(today.toISOString())).toBe(true);
    });
  });

  describe('isPast', () => {
    it('過去の日付はtrueを返す', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isPast(past.toISOString())).toBe(true);
    });

    it('未来の日付はfalseを返す', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isPast(future.toISOString())).toBe(false);
    });
  });

  describe('isFuture', () => {
    it('未来の日付はtrueを返す', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isFuture(future.toISOString())).toBe(true);
    });

    it('過去の日付はfalseを返す', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isFuture(past.toISOString())).toBe(false);
    });
  });

  describe('sortSchedulesByDate', () => {
    it('日付が近い順にソートする', () => {
      const schedules: ScheduleRow[] = [
        createMockSchedule('1', '2025-01-15T10:00:00Z'),
        createMockSchedule('2', '2025-01-10T10:00:00Z'),
        createMockSchedule('3', '2025-01-20T10:00:00Z'),
      ];
      const sorted = sortSchedulesByDate(schedules);
      expect(sorted.map((s) => s.id)).toEqual(['2', '1', '3']);
    });

    it('元の配列を変更しない', () => {
      const original: ScheduleRow[] = [
        createMockSchedule('1', '2025-01-15T10:00:00Z'),
        createMockSchedule('2', '2025-01-10T10:00:00Z'),
      ];
      const originalCopy = [...original];
      sortSchedulesByDate(original);
      expect(original).toEqual(originalCopy);
    });
  });

  describe('filterCompletedSchedules', () => {
    it('完了済みの予定のみ返す', () => {
      const schedules: ScheduleRow[] = [
        createMockSchedule('1', '2025-01-15T10:00:00Z', true),
        createMockSchedule('2', '2025-01-16T10:00:00Z', false),
        createMockSchedule('3', '2025-01-17T10:00:00Z', true),
      ];
      const completed = filterCompletedSchedules(schedules);
      expect(completed.map((s) => s.id)).toEqual(['1', '3']);
    });

    it('すべて未完了なら空配列を返す', () => {
      const schedules: ScheduleRow[] = [
        createMockSchedule('1', '2025-01-15T10:00:00Z', false),
        createMockSchedule('2', '2025-01-16T10:00:00Z', false),
      ];
      expect(filterCompletedSchedules(schedules)).toEqual([]);
    });
  });

  describe('filterIncompleteSchedules', () => {
    it('未完了の予定のみ返す', () => {
      const schedules: ScheduleRow[] = [
        createMockSchedule('1', '2025-01-15T10:00:00Z', true),
        createMockSchedule('2', '2025-01-16T10:00:00Z', false),
        createMockSchedule('3', '2025-01-17T10:00:00Z', false),
      ];
      const incomplete = filterIncompleteSchedules(schedules);
      expect(incomplete.map((s) => s.id)).toEqual(['2', '3']);
    });

    it('すべて完了済みなら空配列を返す', () => {
      const schedules: ScheduleRow[] = [
        createMockSchedule('1', '2025-01-15T10:00:00Z', true),
        createMockSchedule('2', '2025-01-16T10:00:00Z', true),
      ];
      expect(filterIncompleteSchedules(schedules)).toEqual([]);
    });
  });
});

function createMockSchedule(
  id: string,
  scheduledAt: string,
  isCompleted = false
): ScheduleRow {
  const now = new Date().toISOString();
  return {
    id,
    user_id: 'user-123',
    machi_id: 'sta_tokyo',
    scheduled_at: scheduledAt,
    title: 'テスト予定',
    memo: null,
    is_completed: isCompleted,
    completed_at: isCompleted ? now : null,
    created_at: now,
    updated_at: now,
  };
}
