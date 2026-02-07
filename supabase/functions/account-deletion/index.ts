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
import { getCorsHeaders } from "../_shared/cors.ts";

// pg_cronからの呼び出し用シークレットキー
const CRON_SECRET = Deno.env.get("CRON_SECRET");

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

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
      return await processExpiredRequests(supabase, corsHeaders);
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
        return await createDeletionRequest(supabase, user.id, user.email, reason, corsHeaders);
      case "cancel":
        return await cancelDeletionRequest(supabase, user.id, corsHeaders);
      case "status":
        return await getDeletionStatus(supabase, user.id, corsHeaders);
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
  reason: string | undefined,
  corsHeaders: Record<string, string>
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

  // usersテーブルのstatusをdeletion_pendingに設定
  const { error: updateError } = await supabase
    .from("users")
    .update({
      status: "deletion_pending",
      deletion_requested_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    console.error("[account-deletion] ユーザーステータス更新エラー:", updateError);
    // リクエストは作成済みなので、エラーログのみ
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
  userId: string,
  corsHeaders: Record<string, string>
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

  // usersテーブルのstatusをactiveに戻す
  const { error: updateError } = await supabase
    .from("users")
    .update({
      status: "active",
      deletion_requested_at: null,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("[account-deletion] ユーザーステータス更新エラー:", updateError);
    // キャンセルは成功しているので、エラーログのみ
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
  userId: string,
  corsHeaders: Record<string, string>
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

// ===============================
// Storage バケット定数
// ===============================

const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  SPOT_IMAGES: "spot-images",
  MAP_THUMBNAILS: "map-thumbnails",
  COLLECTION_THUMBNAILS: "collection-thumbnails",
} as const;

/**
 * 指定バケットのフォルダ内ファイルを全て削除
 * originals/ プレフィックスのバックアップも削除
 */
async function deleteStorageFolder(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  folder: string
): Promise<number> {
  let deletedCount = 0;

  for (const prefix of [folder, `originals/${folder}`]) {
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000 });

    if (error) {
      console.warn(
        `[account-deletion] Storage list エラー: bucket=${bucket}, prefix=${prefix}`,
        error.message
      );
      continue;
    }

    if (!files || files.length === 0) continue;

    // フォルダ（.emptyFolderPlaceholder等）を除外し、実ファイルのみ
    const paths = files
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => `${prefix}/${f.name}`);

    if (paths.length === 0) continue;

    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (removeError) {
      console.warn(
        `[account-deletion] Storage 削除エラー: bucket=${bucket}, paths=${paths.length}件`,
        removeError.message
      );
    } else {
      deletedCount += paths.length;
    }
  }

  return deletedCount;
}

/**
 * ユーザーに紐づく全てのStorageファイルを削除
 *
 * 対象バケットとパス構造:
 * - avatars: {userId}/...
 * - map-thumbnails: {userId}/...
 * - collection-thumbnails: {userId}/...
 * - spot-images: {spotId}/... (user_spotsテーブル経由)
 */
async function deleteUserStorageFiles(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ totalDeleted: number; errors: string[] }> {
  let totalDeleted = 0;
  const storageErrors: string[] = [];

  // 1. userId ベースのバケット（avatars, map-thumbnails, collection-thumbnails）
  const userIdBuckets = [
    STORAGE_BUCKETS.AVATARS,
    STORAGE_BUCKETS.MAP_THUMBNAILS,
    STORAGE_BUCKETS.COLLECTION_THUMBNAILS,
  ];

  for (const bucket of userIdBuckets) {
    try {
      const deleted = await deleteStorageFolder(supabase, bucket, userId);
      if (deleted > 0) {
        console.log(
          `[account-deletion] Storage削除: bucket=${bucket}, ${deleted}件`
        );
      }
      totalDeleted += deleted;
    } catch (err) {
      const msg = `${bucket}: ${err instanceof Error ? err.message : "Unknown error"}`;
      console.error(`[account-deletion] Storage削除エラー: ${msg}`);
      storageErrors.push(msg);
    }
  }

  // 2. spot-images: user_spotsテーブルからspotIdを取得して削除
  try {
    const { data: spots, error: spotsError } = await supabase
      .from("user_spots")
      .select("id")
      .eq("user_id", userId);

    if (spotsError) {
      console.error(
        "[account-deletion] user_spots取得エラー:",
        spotsError.message
      );
      storageErrors.push(`spot-images(query): ${spotsError.message}`);
    } else if (spots && spots.length > 0) {
      for (const spot of spots) {
        try {
          const deleted = await deleteStorageFolder(
            supabase,
            STORAGE_BUCKETS.SPOT_IMAGES,
            spot.id
          );
          totalDeleted += deleted;
        } catch (err) {
          const msg = `spot-images/${spot.id}: ${err instanceof Error ? err.message : "Unknown error"}`;
          console.error(`[account-deletion] Storage削除エラー: ${msg}`);
          storageErrors.push(msg);
        }
      }
      if (spots.length > 0) {
        console.log(
          `[account-deletion] spot-images: ${spots.length}スポット分のStorage削除完了`
        );
      }
    }
  } catch (err) {
    const msg = `spot-images: ${err instanceof Error ? err.message : "Unknown error"}`;
    console.error(`[account-deletion] Storage削除エラー: ${msg}`);
    storageErrors.push(msg);
  }

  return { totalDeleted, errors: storageErrors };
}

/**
 * 期限切れの削除リクエストを処理（pg_cronから呼び出し）
 */
async function processExpiredRequests(
  supabase: ReturnType<typeof createClient>,
  corsHeaders: Record<string, string>
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
      // 1. Storageファイルを削除（DB CASCADE前に実行）
      // user_spotsのIDが必要なため、auth.users削除より先に行う
      const storageResult = await deleteUserStorageFiles(
        supabase,
        request.user_id
      );
      if (storageResult.totalDeleted > 0) {
        console.log(
          `[account-deletion] Storage削除完了: userId=${request.user_id}, ${storageResult.totalDeleted}件`
        );
      }
      if (storageResult.errors.length > 0) {
        console.warn(
          `[account-deletion] Storage削除で一部エラー: userId=${request.user_id}`,
          storageResult.errors
        );
        // Storage削除エラーがあっても、アカウント削除は続行する
      }

      // 2. リクエストを完了にマーク + 個人情報を匿名化
      // （ユーザー削除前に実行し、履歴として残す）
      const { error: updateError } = await supabase
        .from("deletion_requests")
        .update({
          email: null, // 匿名化
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (updateError) {
        console.error(
          `[account-deletion] リクエスト更新エラー: userId=${request.user_id}`,
          updateError
        );
      }

      // 3. Auth userを削除（これによりuser_id = NULLになる - ON DELETE SET NULL）
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
