/**
 * 購入検証 API
 *
 * 購入完了/復元後にEdge Functionを呼び出し、
 * RevenueCat REST APIで検証してDBのis_premiumを即時更新する。
 * Webhookの遅延を回避し、購入直後からDBベースの上限チェックが正しく動作する。
 */

import { supabase } from './client';
import { log } from '@/shared/config/logger';

interface VerifyPurchaseResponse {
  isPremium: boolean;
  expiresAt: string | null;
}

/**
 * Edge Function verify-purchase を呼び出して DB の is_premium を即時更新
 * 購入完了・復元後に呼び出す。失敗してもアプリは続行（Webhookで後追い更新される）
 */
export async function verifyPurchaseOnServer(): Promise<VerifyPurchaseResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke<VerifyPurchaseResponse>(
      'verify-purchase',
      { method: 'POST' }
    );

    if (error) {
      log.warn('[verifyPurchase] Edge Function error:', error);
      return null;
    }

    log.info('[verifyPurchase] DB updated:', data);
    return data;
  } catch (err) {
    log.warn('[verifyPurchase] Failed (will be synced by webhook):', err);
    // 失敗してもアプリは続行。WebhookまたはAppState復帰で後追い更新される
    return null;
  }
}
