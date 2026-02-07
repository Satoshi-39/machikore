/**
 * Verify Purchase Edge Function
 *
 * クライアントから購入完了/復元後に呼び出され、
 * RevenueCat REST API でサブスクリプション状態を検証し、
 * DB の is_premium を即時更新する。
 *
 * Webhook の遅延（数秒〜数分）を回避し、購入直後から
 * DB ベースの上限チェック（スポット数、画像数等）が正しく動作する。
 *
 * 認証: Supabase JWT（verify_jwt = true）
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// 環境変数
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const REVENUECAT_SECRET_API_KEY = Deno.env.get('REVENUECAT_SECRET_API_KEY');

// Supabase クライアント（Service Role で全権限）
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// RevenueCat のエンタイトルメント ID
const ENTITLEMENT_ID = 'premium';

interface RevenueCatSubscriber {
  subscriber: {
    entitlements: {
      [key: string]: {
        expires_date: string | null;
        purchase_date: string;
        product_identifier: string;
      };
    };
  };
}

Deno.serve(async (req) => {
  // POST のみ受け付け
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // RevenueCat Secret API Key が未設定の場合はエラー
  if (!REVENUECAT_SECRET_API_KEY) {
    console.error('[verify-purchase] REVENUECAT_SECRET_API_KEY is not set');
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // JWT からユーザー ID を取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[verify-purchase] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    console.log(`[verify-purchase] Verifying purchase for user: ${userId}`);

    // RevenueCat REST API でサブスクライバー情報を取得
    const rcResponse = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${REVENUECAT_SECRET_API_KEY}`,
        },
      }
    );

    if (!rcResponse.ok) {
      console.error(
        `[verify-purchase] RevenueCat API error: ${rcResponse.status} ${rcResponse.statusText}`
      );
      return new Response(
        JSON.stringify({ error: 'Failed to verify with RevenueCat' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rcData: RevenueCatSubscriber = await rcResponse.json();
    const entitlement = rcData.subscriber.entitlements[ENTITLEMENT_ID];

    // エンタイトルメントの有無と期限を確認
    let isPremium = false;
    let expiresAt: string | null = null;

    if (entitlement) {
      expiresAt = entitlement.expires_date;
      // expires_date が null（ライフタイム）または未来ならアクティブ
      isPremium = !expiresAt || new Date(expiresAt) > new Date();
    }

    // DB の is_premium を更新
    const { error: rpcError } = await supabase.rpc('update_user_premium_status', {
      p_user_id: userId,
      p_is_premium: isPremium,
      p_expires_at: expiresAt,
    });

    if (rpcError) {
      console.error('[verify-purchase] Failed to update premium status:', rpcError);
      return new Response(
        JSON.stringify({ error: 'Failed to update status' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(
      `[verify-purchase] Updated: user=${userId}, isPremium=${isPremium}, expiresAt=${expiresAt}`
    );

    return new Response(
      JSON.stringify({ isPremium, expiresAt }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[verify-purchase] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
