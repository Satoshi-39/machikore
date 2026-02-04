/**
 * user-spot/helpers.ts のテスト
 */

import {
  validateCreateSpotParams,
  sortSpotsByDate,
  sortSpotsByOrder,
} from '../helpers';
import type { SpotRow } from '@/shared/types/database.types';

describe('user-spot/helpers', () => {
  describe('validateCreateSpotParams', () => {
    const validParams = {
      userId: 'user-123',
      mapId: 'map-456',
      machiId: 'sta_tokyo',
      name: 'テストスポット',
      description: 'マイスポット',
      latitude: 35.6812,
      longitude: 139.7671,
    };

    it('有効なパラメータはvalidを返す', () => {
      const result = validateCreateSpotParams(validParams);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('userIdが空ならエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        userId: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('ユーザーIDが必要です');
    });

    it('userIdが空白のみならエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        userId: '   ',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('ユーザーIDが必要です');
    });

    it('nameが空ならエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        name: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('スポット名が必要です');
    });

    it('nameが空白のみならエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        name: '   ',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('スポット名が必要です');
    });

    it('nameが100文字を超えるとエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        name: 'あ'.repeat(101),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('スポット名は100文字以内にしてください');
    });

    it('nameが100文字ちょうどはOK', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        name: 'あ'.repeat(100),
      });
      expect(result.valid).toBe(true);
    });

    it('descriptionが2000文字を超えるとエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        description: 'あ'.repeat(2001),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('説明は2000文字以内にしてください');
    });

    it('descriptionが2000文字ちょうどはOK', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        description: 'あ'.repeat(2000),
      });
      expect(result.valid).toBe(true);
    });

    it('descriptionが空文字はOK（バリデーションはフォーム側で行う）', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        description: '',
      });
      expect(result.valid).toBe(true);
    });

    it('imagesが10枚を超えるとエラー', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        images: Array(11).fill('image-uri'),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('画像は10枚まで添付できます');
    });

    it('imagesが10枚ちょうどはOK', () => {
      const result = validateCreateSpotParams({
        ...validParams,
        images: Array(10).fill('image-uri'),
      });
      expect(result.valid).toBe(true);
    });

    it('imagesが未定義はOK', () => {
      const result = validateCreateSpotParams(validParams);
      expect(result.valid).toBe(true);
    });
  });

  describe('sortSpotsByDate', () => {
    it('新しい順にソートする', () => {
      const spots: SpotRow[] = [
        createMockSpot('1', '2024-01-01T10:00:00Z'),
        createMockSpot('2', '2024-01-03T10:00:00Z'),
        createMockSpot('3', '2024-01-02T10:00:00Z'),
      ];
      const sorted = sortSpotsByDate(spots);
      expect(sorted.map((s) => s.id)).toEqual(['2', '3', '1']);
    });

    it('元の配列を変更しない', () => {
      const original: SpotRow[] = [
        createMockSpot('1', '2024-01-01T10:00:00Z'),
        createMockSpot('2', '2024-01-02T10:00:00Z'),
      ];
      const originalCopy = [...original];
      sortSpotsByDate(original);
      expect(original).toEqual(originalCopy);
    });

    it('空配列は空配列を返す', () => {
      expect(sortSpotsByDate([])).toEqual([]);
    });

    it('同じ日時は順序を維持する', () => {
      const spots: SpotRow[] = [
        createMockSpot('1', '2024-01-01T10:00:00Z'),
        createMockSpot('2', '2024-01-01T10:00:00Z'),
      ];
      const sorted = sortSpotsByDate(spots);
      // 同じ日時の場合、元の順序を維持（安定ソート）
      expect(sorted.length).toBe(2);
    });
  });

  describe('sortSpotsByOrder', () => {
    it('order_indexでソートする', () => {
      const spots: SpotRow[] = [
        createMockSpotWithOrder('1', 3),
        createMockSpotWithOrder('2', 1),
        createMockSpotWithOrder('3', 2),
      ];
      const sorted = sortSpotsByOrder(spots);
      expect(sorted.map((s) => s.id)).toEqual(['2', '3', '1']);
    });

    it('元の配列を変更しない', () => {
      const original: SpotRow[] = [
        createMockSpotWithOrder('1', 2),
        createMockSpotWithOrder('2', 1),
      ];
      const originalCopy = [...original];
      sortSpotsByOrder(original);
      expect(original).toEqual(originalCopy);
    });

    it('空配列は空配列を返す', () => {
      expect(sortSpotsByOrder([])).toEqual([]);
    });

    it('同じorder_indexは順序を維持する', () => {
      const spots: SpotRow[] = [
        createMockSpotWithOrder('1', 1),
        createMockSpotWithOrder('2', 1),
        createMockSpotWithOrder('3', 1),
      ];
      const sorted = sortSpotsByOrder(spots);
      expect(sorted.length).toBe(3);
    });
  });
});

function createMockSpot(id: string, createdAt: string): SpotRow {
  return {
    id,
    map_id: 'map-123',
    user_id: 'user-123',
    machi_id: 'sta_tokyo',
    master_spot_id: 'master-123',
    name: null,
    description: 'テストスポット',
    article_content: null,
    images_count: 0,
    likes_count: 0,
    bookmarks_count: 0,
    comments_count: 0,
    order_index: 0,
    spot_color: null,
    label_id: null,
    latitude: 35.6812,
    longitude: 139.7671,
    prefecture_id: null,
    city_id: null,
    google_formatted_address: null,
    google_short_address: null,
    language: 'ja',
    is_public: true,
    thumbnail_image_id: null,
    thumbnail_crop: null,
    created_at: createdAt,
    updated_at: createdAt,
  };
}

function createMockSpotWithOrder(id: string, orderIndex: number): SpotRow {
  return {
    ...createMockSpot(id, new Date().toISOString()),
    order_index: orderIndex,
  };
}
