/**
 * RevenueCat Webhook Handler
 *
 * RevenueCat からのイベントを受け取り、users テーブルの is_premium を更新する
 *
 * イベントタイプ:
 * - INITIAL_PURCHASE: 初回購入
 * - RENEWAL: 更新
 * - CANCELLATION: キャンセル（期限まで有効）
 * - EXPIRATION: 期限切れ
 * - BILLING_ISSUE: 支払い問題
 * - SUBSCRIBER_ALIAS: ユーザーID変更
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 環境変数
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const REVENUECAT_WEBHOOK_AUTH_KEY = Deno.env.get('REVENUECAT_WEBHOOK_AUTH_KEY');

// Supabase クライアント（Service Role で全権限）
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// RevenueCat Webhook イベントの型定義
interface RevenueCatEvent {
  event: {
    type: string;
    app_user_id: string;
    expiration_at_ms?: number;
    product_id?: string;
    entitlement_ids?: string[];
  };
  api_version: string;
}

// プレミアムを有効にするイベント
const PREMIUM_ACTIVE_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
];

// プレミアムを無効にするイベント
const PREMIUM_INACTIVE_EVENTS = [
  'EXPIRATION',
  'BILLING_ISSUE',
];

// キャンセルだが期限まで有効
const PREMIUM_CANCELLATION_EVENTS = [
  'CANCELLATION',
];

Deno.serve(async (req) => {
  // POST のみ受け付け
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // 認証チェック（オプション）
  if (REVENUECAT_WEBHOOK_AUTH_KEY) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${REVENUECAT_WEBHOOK_AUTH_KEY}`) {
      console.error('Unauthorized webhook request');
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const payload: RevenueCatEvent = await req.json();
    const { event } = payload;

    console.log(`[RevenueCat Webhook] Event: ${event.type}, User: ${event.app_user_id}`);

    const userId = event.app_user_id;
    const expiresAt = event.expiration_at_ms
      ? new Date(event.expiration_at_ms).toISOString()
      : null;

    // イベントタイプに応じて処理
    if (PREMIUM_ACTIVE_EVENTS.includes(event.type)) {
      // プレミアム有効化
      await updatePremiumStatus(userId, true, expiresAt);
      console.log(`[RevenueCat Webhook] Premium activated for user: ${userId}`);
    } else if (PREMIUM_INACTIVE_EVENTS.includes(event.type)) {
      // プレミアム無効化
      await updatePremiumStatus(userId, false, null);
      console.log(`[RevenueCat Webhook] Premium deactivated for user: ${userId}`);
    } else if (PREMIUM_CANCELLATION_EVENTS.includes(event.type)) {
      // キャンセル（期限まで有効のまま）
      // is_premium は true のまま、期限を設定
      await updatePremiumStatus(userId, true, expiresAt);
      console.log(`[RevenueCat Webhook] Premium cancelled but active until: ${expiresAt}`);
    } else {
      console.log(`[RevenueCat Webhook] Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[RevenueCat Webhook] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

/**
 * ユーザーのプレミアム状態を更新
 */
async function updatePremiumStatus(
  userId: string,
  isPremium: boolean,
  expiresAt: string | null
): Promise<void> {
  const { error } = await supabase.rpc('update_user_premium_status', {
    p_user_id: userId,
    p_is_premium: isPremium,
    p_expires_at: expiresAt,
  });

  if (error) {
    console.error('[RevenueCat Webhook] Failed to update premium status:', error);
    throw error;
  }
}
