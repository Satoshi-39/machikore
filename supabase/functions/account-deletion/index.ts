/**
 * アカウント削除 Edge Function
 *
 * アクション:
 * - create: 削除リクエストを作成（30日後に削除予定）
 * - cancel: 削除リクエストをキャンセル
 * - process: 期限切れのリクエストを処理（pg_cronから呼び出し）
 * - status: 現在の削除リクエスト状態を取得
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// pg_cronからの呼び出し用シークレットキー
const CRON_SECRET = Deno.env.get("CRON_SECRET");

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // リクエストボディを一度だけパース
    const body = await req.json();
    const { action, reason } = body;

    // processアクションはcronからの呼び出し（認証不要、シークレットキーで認証）
    if (action === "process") {
      const cronSecret = req.headers.get("x-cron-secret");
      if (!CRON_SECRET || cronSecret !== CRON_SECRET) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return await processExpiredRequests(supabase);
    }

    // その他のアクションはユーザー認証が必要
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "認証が必要です" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "認証に失敗しました" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "create":
        return await createDeletionRequest(supabase, user.id, user.email, reason);
      case "cancel":
        return await cancelDeletionRequest(supabase, user.id);
      case "status":
        return await getDeletionStatus(supabase, user.id);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    console.error("[account-deletion] 例外:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * 削除リクエストを作成
 */
async function createDeletionRequest(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string | undefined,
  reason: string | undefined
) {
  console.log(`[account-deletion] 削除リクエスト作成: userId=${userId}`);

  // 既存のpendingリクエストがあるかチェック
  const { data: existing } = await supabase
    .from("deletion_requests")
    .select("id, scheduled_at")
    .eq("user_id", userId)
    .eq("status", "pending")
    .single();

  if (existing) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "既に削除リクエストが存在します",
        scheduled_at: existing.scheduled_at,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 新規リクエストを作成
  const { data, error } = await supabase
    .from("deletion_requests")
    .insert({
      user_id: userId,
      email: email ?? null,
      reason: reason ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("[account-deletion] リクエスト作成エラー:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.log(`[account-deletion] リクエスト作成成功: id=${data.id}`);

  return new Response(
    JSON.stringify({
      success: true,
      message: "削除リクエストを受け付けました",
      scheduled_at: data.scheduled_at,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * 削除リクエストをキャンセル
 */
async function cancelDeletionRequest(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  console.log(`[account-deletion] 削除リクエストキャンセル: userId=${userId}`);

  const { data, error } = await supabase
    .from("deletion_requests")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "キャンセル可能な削除リクエストがありません",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    console.error("[account-deletion] キャンセルエラー:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.log(`[account-deletion] キャンセル成功: id=${data.id}`);

  return new Response(
    JSON.stringify({
      success: true,
      message: "削除リクエストをキャンセルしました",
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * 削除リクエストの状態を取得
 */
async function getDeletionStatus(
  supabase: ReturnType<typeof createClient>,
  userId: string
) {
  const { data, error } = await supabase
    .from("deletion_requests")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .single();

  if (error && error.code !== "PGRST116") {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      has_pending_request: !!data,
      request: data || null,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * 期限切れの削除リクエストを処理（pg_cronから呼び出し）
 */
async function processExpiredRequests(
  supabase: ReturnType<typeof createClient>
) {
  console.log("[account-deletion] 期限切れリクエストの処理開始");

  // 期限切れのpendingリクエストを取得
  const { data: expiredRequests, error: fetchError } = await supabase
    .from("deletion_requests")
    .select("id, user_id")
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString());

  if (fetchError) {
    console.error("[account-deletion] 取得エラー:", fetchError);
    return new Response(
      JSON.stringify({ success: false, error: fetchError.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (!expiredRequests || expiredRequests.length === 0) {
    console.log("[account-deletion] 処理対象なし");
    return new Response(
      JSON.stringify({ success: true, processed: 0 }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.log(`[account-deletion] 処理対象: ${expiredRequests.length}件`);

  let processed = 0;
  const errors: string[] = [];

  for (const request of expiredRequests) {
    try {
      // 1. ユーザーの関連データを削除（CASCADE設定があれば自動削除される）
      // 明示的に削除が必要な場合はここに追加

      // 2. Auth userを削除
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
        request.user_id
      );

      if (deleteAuthError) {
        console.error(
          `[account-deletion] Auth削除エラー: userId=${request.user_id}`,
          deleteAuthError
        );
        errors.push(`${request.user_id}: ${deleteAuthError.message}`);
        continue;
      }

      // 3. リクエストを完了にマーク
      await supabase
        .from("deletion_requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      console.log(`[account-deletion] 削除完了: userId=${request.user_id}`);
      processed++;
    } catch (err) {
      console.error(
        `[account-deletion] 処理エラー: userId=${request.user_id}`,
        err
      );
      errors.push(
        `${request.user_id}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  console.log(
    `[account-deletion] 処理完了: ${processed}/${expiredRequests.length}件`
  );

  return new Response(
    JSON.stringify({
      success: true,
      processed,
      total: expiredRequests.length,
      errors: errors.length > 0 ? errors : undefined,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
