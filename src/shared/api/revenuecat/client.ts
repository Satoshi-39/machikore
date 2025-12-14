/**
 * RevenueCat クライアント
 *
 * サブスクリプション管理のための初期化と基本設定
 * 将来的にStripe連携時も、このレイヤーで抽象化して対応可能
 */

import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { ENV, SUBSCRIPTION } from '@/shared/config';

// Entitlement ID（RevenueCatダッシュボードで設定した名前）
export const ENTITLEMENT_ID = SUBSCRIPTION.ENTITLEMENT_ID;

// ===============================
// 初期化
// ===============================

let isInitialized = false;

/**
 * RevenueCatを初期化
 * アプリ起動時に一度だけ呼び出す
 */
export async function initializeRevenueCat(): Promise<void> {
  if (isInitialized) {
    console.log('[RevenueCat] Already initialized');
    return;
  }

  const apiKey = ENV.REVENUECAT_API_KEY;

  if (!apiKey) {
    console.error('[RevenueCat] API key not found');
    return;
  }

  try {
    // デバッグ用ログレベル設定（本番ではWARNに）
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.WARN);
    }

    // プラットフォームに応じた初期化
    Purchases.configure({
      apiKey,
    });

    isInitialized = true;
    console.log('[RevenueCat] Initialized successfully');
  } catch (error) {
    console.error('[RevenueCat] Initialization failed:', error);
    throw error;
  }
}

// ===============================
// ユーザー識別
// ===============================

/**
 * ユーザーをRevenueCatにログイン
 * Supabaseの認証後に呼び出す
 */
export async function loginToRevenueCat(userId: string): Promise<CustomerInfo> {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('[RevenueCat] User logged in:', userId);
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Login failed:', error);
    throw error;
  }
}

/**
 * RevenueCatからログアウト
 * Supabaseのサインアウト時に呼び出す
 */
export async function logoutFromRevenueCat(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.logOut();
    console.log('[RevenueCat] User logged out');
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Logout failed:', error);
    throw error;
  }
}

// ===============================
// サブスクリプション情報取得
// ===============================

/**
 * 現在の顧客情報を取得
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Failed to get customer info:', error);
    throw error;
  }
}

/**
 * 利用可能なオファリング（商品一覧）を取得
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('[RevenueCat] Failed to get offerings:', error);
    throw error;
  }
}

/**
 * プレミアムプランがアクティブかどうかを確認
 */
export function isPremiumActive(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

// ===============================
// 購入処理
// ===============================

/**
 * パッケージを購入
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; productIdentifier: string }> {
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(pkg);
    console.log('[RevenueCat] Purchase successful:', productIdentifier);
    return { customerInfo, productIdentifier };
  } catch (error: any) {
    // ユーザーがキャンセルした場合
    if (error.userCancelled) {
      console.log('[RevenueCat] Purchase cancelled by user');
      throw new Error('PURCHASE_CANCELLED');
    }
    console.error('[RevenueCat] Purchase failed:', error);
    throw error;
  }
}

/**
 * 購入を復元
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('[RevenueCat] Purchases restored');
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Restore failed:', error);
    throw error;
  }
}

// ===============================
// 型エクスポート
// ===============================

export type { CustomerInfo, PurchasesOffering, PurchasesPackage };
