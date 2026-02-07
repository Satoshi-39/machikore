/**
 * サブスクリプション状態管理
 *
 * RevenueCatからのサブスクリプション情報をZustandで管理
 * 将来的にStripe連携時も同じインターフェースで対応可能
 */

import { create } from 'zustand';
import {
  getCustomerInfo,
  isPremiumActive,
  type CustomerInfo,
} from '@/shared/api/revenuecat';
import { SUBSCRIPTION } from '@/shared/config/constants';
import { log } from '@/shared/config/logger';

// ===============================
// 型定義
// ===============================

interface SubscriptionState {
  /** プレミアム会員かどうか */
  isPremium: boolean;
  /** ローディング中かどうか */
  isLoading: boolean;
  /** RevenueCatの顧客情報 */
  customerInfo: CustomerInfo | null;
  /** エラーメッセージ */
  error: string | null;
}

interface SubscriptionActions {
  /** サブスクリプション状態を更新 */
  setSubscriptionStatus: (isPremium: boolean, customerInfo?: CustomerInfo) => void;
  /** ローディング状態を設定 */
  setLoading: (isLoading: boolean) => void;
  /** エラーを設定 */
  setError: (error: string | null) => void;
  /** RevenueCatから最新の状態を取得して更新 */
  refreshSubscriptionStatus: () => Promise<void>;
  /** 状態をリセット（ログアウト時） */
  reset: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

// ===============================
// 初期状態
// ===============================

const initialState: SubscriptionState = {
  isPremium: false,
  isLoading: false,
  customerInfo: null,
  error: null,
};

// ===============================
// ストア作成
// ===============================

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  ...initialState,

  setSubscriptionStatus: (isPremium, customerInfo) => {
    set({
      isPremium,
      customerInfo: customerInfo ?? get().customerInfo,
      error: null,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  refreshSubscriptionStatus: async () => {
    set({ isLoading: true, error: null });

    try {
      const customerInfo = await getCustomerInfo();
      const isPremium = isPremiumActive(customerInfo);

      set({
        isPremium,
        customerInfo,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      log.error('[Subscription] Failed to refresh status:', error);
      set({
        isLoading: false,
        error: 'サブスクリプション情報の取得に失敗しました',
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));

// ===============================
// セレクター
// ===============================

/** プレミアム会員かどうかを取得 */
export const selectIsPremium = (state: SubscriptionStore) => state.isPremium;

/** スポット作成上限を取得 */
export const selectSpotLimit = (state: SubscriptionStore) =>
  state.isPremium ? SUBSCRIPTION.PREMIUM_SPOT_LIMIT : SUBSCRIPTION.FREE_SPOT_LIMIT;

/** 画像アップロード上限を取得（スポットごと） */
export const selectImageLimit = (state: SubscriptionStore) =>
  state.isPremium ? SUBSCRIPTION.PREMIUM_IMAGE_LIMIT : SUBSCRIPTION.FREE_IMAGE_LIMIT;

/** ブックマーク上限を取得（フォルダごと） */
export const selectBookmarkPerFolderLimit = (state: SubscriptionStore) =>
  state.isPremium ? SUBSCRIPTION.PREMIUM_BOOKMARKS_PER_FOLDER : SUBSCRIPTION.FREE_BOOKMARKS_PER_FOLDER;

/** ブックマーク上限を取得（後で見る） */
export const selectBookmarkUncategorizedLimit = (state: SubscriptionStore) =>
  state.isPremium ? SUBSCRIPTION.PREMIUM_BOOKMARKS_UNCATEGORIZED : SUBSCRIPTION.FREE_BOOKMARKS_UNCATEGORIZED;

/** フォルダ上限を取得 */
export const selectFolderCountLimit = (state: SubscriptionStore) =>
  state.isPremium ? SUBSCRIPTION.PREMIUM_FOLDER_LIMIT : SUBSCRIPTION.FREE_FOLDER_LIMIT;

/** コレクション上限を取得 */
export const selectCollectionLimit = (state: SubscriptionStore) =>
  state.isPremium ? SUBSCRIPTION.PREMIUM_COLLECTION_LIMIT : SUBSCRIPTION.FREE_COLLECTION_LIMIT;

/** ローディング中かどうかを取得 */
export const selectIsLoading = (state: SubscriptionStore) => state.isLoading;

// ===============================
// カスタムフック
// ===============================

/**
 * プレミアム会員かどうかを取得するhook
 */
export function useIsPremium(): boolean {
  return useSubscriptionStore(selectIsPremium);
}

/**
 * スポット作成上限を取得するhook
 */
export function useSpotLimit(): number {
  return useSubscriptionStore(selectSpotLimit);
}

/**
 * 画像アップロード上限を取得するhook（スポットごと）
 */
export function useImageLimit(): number {
  return useSubscriptionStore(selectImageLimit);
}

/**
 * ブックマーク上限を取得するhook（フォルダごと）
 */
export function useBookmarkPerFolderLimit(): number {
  return useSubscriptionStore(selectBookmarkPerFolderLimit);
}

/**
 * ブックマーク上限を取得するhook（後で見る）
 */
export function useBookmarkUncategorizedLimit(): number {
  return useSubscriptionStore(selectBookmarkUncategorizedLimit);
}

/**
 * フォルダ上限を取得するhook
 */
export function useFolderCountLimit(): number {
  return useSubscriptionStore(selectFolderCountLimit);
}

/**
 * コレクション上限を取得するhook
 */
export function useCollectionLimit(): number {
  return useSubscriptionStore(selectCollectionLimit);
}

/**
 * サブスクリプションのローディング状態を取得するhook
 */
export function useSubscriptionLoading(): boolean {
  return useSubscriptionStore(selectIsLoading);
}
