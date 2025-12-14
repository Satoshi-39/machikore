/**
 * サブスクリプション購入フック
 *
 * RevenueCatを使用した購入処理を提供
 */

import { useState, useCallback, useEffect } from 'react';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  isPremiumActive,
  type PurchasesOffering,
  type PurchasesPackage,
} from '@/shared/api/revenuecat';
import { useSubscriptionStore } from '@/entities/subscription';

interface UsePurchaseResult {
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

export function usePurchase(): UsePurchaseResult {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSubscriptionStatus = useSubscriptionStore(
    (state) => state.setSubscriptionStatus
  );

  // オファリングを取得
  const refreshOfferings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentOffering = await getOfferings();
      setOffering(currentOffering);
    } catch (err) {
      console.error('[usePurchase] Failed to get offerings:', err);
      setError('プランの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初期化時にオファリングを取得
  useEffect(() => {
    refreshOfferings();
  }, [refreshOfferings]);

  // 購入を実行
  const purchase = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      setIsPurchasing(true);
      setError(null);

      try {
        const { customerInfo } = await purchasePackage(pkg);
        const isPremium = isPremiumActive(customerInfo);
        setSubscriptionStatus(isPremium, customerInfo);
        return isPremium;
      } catch (err: any) {
        if (err.message === 'PURCHASE_CANCELLED') {
          // ユーザーがキャンセルした場合はエラーとして扱わない
          return false;
        }
        console.error('[usePurchase] Purchase failed:', err);
        setError('購入に失敗しました。もう一度お試しください。');
        return false;
      } finally {
        setIsPurchasing(false);
      }
    },
    [setSubscriptionStatus]
  );

  // 購入を復元
  const restore = useCallback(async (): Promise<boolean> => {
    setIsRestoring(true);
    setError(null);

    try {
      const customerInfo = await restorePurchases();
      const isPremium = isPremiumActive(customerInfo);
      setSubscriptionStatus(isPremium, customerInfo);

      if (!isPremium) {
        setError('復元可能な購入が見つかりませんでした');
      }

      return isPremium;
    } catch (err) {
      console.error('[usePurchase] Restore failed:', err);
      setError('購入の復元に失敗しました');
      return false;
    } finally {
      setIsRestoring(false);
    }
  }, [setSubscriptionStatus]);

  return {
    offering,
    isLoading,
    isPurchasing,
    isRestoring,
    error,
    purchase,
    restore,
    refreshOfferings,
  };
}
