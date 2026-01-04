/**
 * サブスクリプション購入 Feature 型定義
 */

import type { PurchasesOffering, PurchasesPackage } from '@/shared/api/revenuecat';

/**
 * usePurchaseの戻り値
 */
export interface UsePurchaseResult {
  /** 現在のオファリング */
  offering: PurchasesOffering | null;
  /** ローディング中かどうか */
  isLoading: boolean;
  /** 購入処理中かどうか */
  isPurchasing: boolean;
  /** 復元処理中かどうか */
  isRestoring: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 購入を実行 */
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  /** 購入を復元 */
  restore: () => Promise<boolean>;
  /** オファリングを再取得 */
  refreshOfferings: () => Promise<void>;
}
