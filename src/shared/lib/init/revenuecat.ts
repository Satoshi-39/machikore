/**
 * RevenueCat初期化
 */

import { initializeRevenueCat } from '@/shared/api/revenuecat';

/**
 * RevenueCatを初期化
 */
export async function initRevenueCat(): Promise<void> {
  try {
    await initializeRevenueCat();
  } catch (error) {
    // RevenueCat初期化失敗はアプリの動作に致命的ではないため、警告のみ
    console.warn('[initRevenueCat] Failed to initialize:', error);
  }
}
