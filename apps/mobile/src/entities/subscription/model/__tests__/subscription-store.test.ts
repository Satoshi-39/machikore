/**
 * subscription-store.ts のテスト
 *
 * セレクター関数のみテスト（純粋関数）
 */

// RevenueCatモジュールをモック（subscription-storeがインポートする前に）
jest.mock('@/shared/api/revenuecat', () => ({
  getCustomerInfo: jest.fn(),
  isPremiumActive: jest.fn(),
}));

import {
  selectIsPremium,
  selectSpotLimit,
  selectImageLimit,
  selectBookmarkPerFolderLimit,
  selectBookmarkUncategorizedLimit,
  selectFolderCountLimit,
  selectCollectionLimit,
  selectIsLoading,
} from '../subscription-store';
import { SUBSCRIPTION } from '@/shared/config/constants';

// モックのストア状態を作成するヘルパー
function createMockState(overrides: {
  isPremium?: boolean;
  isLoading?: boolean;
  customerInfo?: null;
  error?: string | null;
}) {
  return {
    isPremium: false,
    isLoading: false,
    customerInfo: null,
    error: null,
    setSubscriptionStatus: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    refreshSubscriptionStatus: jest.fn(),
    reset: jest.fn(),
    ...overrides,
  };
}

describe('subscription-store selectors', () => {
  describe('selectIsPremium', () => {
    it('プレミアム会員の場合trueを返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectIsPremium(state)).toBe(true);
    });

    it('無料会員の場合falseを返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectIsPremium(state)).toBe(false);
    });
  });

  describe('selectSpotLimit', () => {
    it('プレミアム会員の場合はプレミアム上限を返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectSpotLimit(state)).toBe(SUBSCRIPTION.PREMIUM_SPOT_LIMIT);
    });

    it('無料会員の場合は無料上限を返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectSpotLimit(state)).toBe(SUBSCRIPTION.FREE_SPOT_LIMIT);
    });

    it('プレミアム上限は無料上限より大きい', () => {
      expect(SUBSCRIPTION.PREMIUM_SPOT_LIMIT).toBeGreaterThan(
        SUBSCRIPTION.FREE_SPOT_LIMIT
      );
    });

    it('無料上限は5', () => {
      expect(SUBSCRIPTION.FREE_SPOT_LIMIT).toBe(5);
    });

    it('プレミアム上限は10', () => {
      expect(SUBSCRIPTION.PREMIUM_SPOT_LIMIT).toBe(10);
    });
  });

  describe('selectImageLimit', () => {
    it('プレミアム会員の場合はプレミアム上限を返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectImageLimit(state)).toBe(SUBSCRIPTION.PREMIUM_IMAGE_LIMIT);
    });

    it('無料会員の場合は無料上限を返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectImageLimit(state)).toBe(SUBSCRIPTION.FREE_IMAGE_LIMIT);
    });

    it('無料上限は4、プレミアム上限は10', () => {
      expect(SUBSCRIPTION.FREE_IMAGE_LIMIT).toBe(4);
      expect(SUBSCRIPTION.PREMIUM_IMAGE_LIMIT).toBe(10);
    });
  });

  describe('selectBookmarkPerFolderLimit', () => {
    it('プレミアム会員の場合はプレミアム上限を返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectBookmarkPerFolderLimit(state)).toBe(SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER);
    });

    it('無料会員の場合は無料上限を返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectBookmarkPerFolderLimit(state)).toBe(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER);
    });

    it('無料上限は15、プレミアム上限は30', () => {
      expect(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER).toBe(15);
      expect(SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER).toBe(30);
    });
  });

  describe('selectBookmarkUncategorizedLimit', () => {
    it('プレミアム会員の場合はプレミアム上限を返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectBookmarkUncategorizedLimit(state)).toBe(SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED);
    });

    it('無料会員の場合は無料上限を返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectBookmarkUncategorizedLimit(state)).toBe(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED);
    });

    it('無料上限は100、プレミアム上限は300', () => {
      expect(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED).toBe(100);
      expect(SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED).toBe(300);
    });
  });

  describe('selectFolderCountLimit', () => {
    it('プレミアム会員の場合はプレミアム上限を返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectFolderCountLimit(state)).toBe(SUBSCRIPTION.PREMIUM_FOLDER_LIMIT);
    });

    it('無料会員の場合は無料上限を返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectFolderCountLimit(state)).toBe(SUBSCRIPTION.FREE_FOLDER_LIMIT);
    });

    it('無料上限は10、プレミアム上限は30', () => {
      expect(SUBSCRIPTION.FREE_FOLDER_LIMIT).toBe(10);
      expect(SUBSCRIPTION.PREMIUM_FOLDER_LIMIT).toBe(30);
    });
  });

  describe('selectCollectionLimit', () => {
    it('プレミアム会員の場合はプレミアム上限を返す', () => {
      const state = createMockState({ isPremium: true });
      expect(selectCollectionLimit(state)).toBe(SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT);
    });

    it('無料会員の場合は無料上限を返す', () => {
      const state = createMockState({ isPremium: false });
      expect(selectCollectionLimit(state)).toBe(SUBSCRIPTION.FREE_COLLECTION_LIMIT);
    });

    it('無料上限は3、プレミアム上限は10', () => {
      expect(SUBSCRIPTION.FREE_COLLECTION_LIMIT).toBe(3);
      expect(SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT).toBe(10);
    });
  });

  describe('全セレクターの整合性', () => {
    it('すべてのプレミアム上限は対応する無料上限より大きい', () => {
      expect(SUBSCRIPTION.PREMIUM_SPOT_LIMIT).toBeGreaterThan(SUBSCRIPTION.FREE_SPOT_LIMIT);
      expect(SUBSCRIPTION.PREMIUM_IMAGE_LIMIT).toBeGreaterThan(SUBSCRIPTION.FREE_IMAGE_LIMIT);
      expect(SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER).toBeGreaterThan(SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER);
      expect(SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED).toBeGreaterThan(SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED);
      expect(SUBSCRIPTION.PREMIUM_FOLDER_LIMIT).toBeGreaterThan(SUBSCRIPTION.FREE_FOLDER_LIMIT);
      expect(SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT).toBeGreaterThan(SUBSCRIPTION.FREE_COLLECTION_LIMIT);
    });
  });

  describe('selectIsLoading', () => {
    it('ローディング中の場合trueを返す', () => {
      const state = createMockState({ isLoading: true });
      expect(selectIsLoading(state)).toBe(true);
    });

    it('ローディング中でない場合falseを返す', () => {
      const state = createMockState({ isLoading: false });
      expect(selectIsLoading(state)).toBe(false);
    });
  });
});
