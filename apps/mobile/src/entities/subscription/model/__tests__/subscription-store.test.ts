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

    it('無料上限は30', () => {
      expect(SUBSCRIPTION.FREE_SPOT_LIMIT).toBe(30);
    });

    it('プレミアム上限は100', () => {
      expect(SUBSCRIPTION.PREMIUM_SPOT_LIMIT).toBe(100);
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
