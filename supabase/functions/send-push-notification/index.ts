/**
 * プッシュ通知送信 Edge Function
 *
 * DBトリガーから呼び出され、Expo Push APIを使って通知を送信
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Expo Push API エンドポイント
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface NotificationPayload {
  notification_id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  spot_id: string | null;
  map_id: string | null;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data: {
    type: string;
    notificationId: string;
    spotId?: string;
    mapId?: string;
    userId?: string;
  };
  sound: "default" | null;
  badge?: number;
}

/**
 * 通知タイプに応じたメッセージを生成
 */
function generateNotificationMessage(
  type: string,
  actorName: string,
  spotName?: string,
  mapName?: string
): { title: string; body: string } {
  switch (type) {
    case "like_spot":
      return {
        title: "いいね",
        body: `${actorName}さんがあなたのスポット「${spotName || ""}」にいいねしました`,
      };
    case "like_map":
      return {
        title: "いいね",
        body: `${actorName}さんがあなたのマップ「${mapName || ""}」にいいねしました`,
      };
    case "comment_spot":
      return {
        title: "コメント",
        body: `${actorName}さんがあなたのスポット「${spotName || ""}」にコメントしました`,
      };
    case "comment_map":
      return {
        title: "コメント",
        body: `${actorName}さんがあなたのマップ「${mapName || ""}」にコメントしました`,
      };
    case "follow":
      return {
        title: "フォロー",
        body: `${actorName}さんがあなたをフォローしました`,
      };
    default:
      return {
        title: "お知らせ",
        body: "新しい通知があります",
      };
  }
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // リクエストボディを取得
    const body = await req.json();
    console.log("[send-push-notification] Received:", body);

    // Webhookからのデータ形式を処理
    // Webhookは { type: "INSERT", table: "notifications", record: {...} } の形式で送る
    const payload: NotificationPayload = body.record ? {
      notification_id: body.record.id,
      user_id: body.record.user_id,
      actor_id: body.record.actor_id,
      type: body.record.type,
      spot_id: body.record.spot_id,
      map_id: body.record.map_id,
    } : body;

    console.log("[send-push-notification] Parsed payload:", payload);

    // Supabaseクライアント作成
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 受信者のpush_tokenを取得
    const { data: recipient, error: recipientError } = await supabase
      .from("users")
      .select("push_token")
      .eq("id", payload.user_id)
      .single();

    if (recipientError || !recipient?.push_token) {
      console.log(
        "[send-push-notification] No push token for user:",
        payload.user_id
      );
      return new Response(
        JSON.stringify({ success: false, reason: "no_push_token" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 通知設定を取得
    const { data: notificationSettings } = await supabase
      .from("user_notification_settings")
      .select("push_enabled, like_enabled, comment_enabled, follow_enabled, system_enabled")
      .eq("user_id", payload.user_id)
      .single();

    // 設定がない場合はデフォルトで全てON
    const settings = notificationSettings || {
      push_enabled: true,
      like_enabled: true,
      comment_enabled: true,
      follow_enabled: true,
      system_enabled: true,
    };

    console.log("[send-push-notification] Notification settings:", settings);

    // マスター設定がOFFなら送信しない
    if (!settings.push_enabled) {
      console.log("[send-push-notification] Push notifications disabled for user");
      return new Response(
        JSON.stringify({ success: false, reason: "push_disabled" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 通知タイプ別の設定をチェック
    const isNotificationEnabled = (() => {
      switch (payload.type) {
        case "like_spot":
        case "like_map":
          return settings.like_enabled;
        case "comment_spot":
        case "comment_map":
          return settings.comment_enabled;
        case "follow":
          return settings.follow_enabled;
        case "system":
          return settings.system_enabled;
        default:
          return true; // 不明なタイプはデフォルトで送信
      }
    })();

    if (!isNotificationEnabled) {
      console.log(`[send-push-notification] ${payload.type} notifications disabled for user`);
      return new Response(
        JSON.stringify({ success: false, reason: "notification_type_disabled" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // アクターの情報を取得（システム通知以外）
    let actorName = "誰か";
    if (payload.actor_id) {
      const { data: actor, error: actorError } = await supabase
        .from("users")
        .select("display_name")
        .eq("id", payload.actor_id)
        .single();

      console.log("[send-push-notification] Actor query:", {
        actor_id: payload.actor_id,
        actor,
        error: actorError,
      });

      if (actor?.display_name) {
        actorName = actor.display_name;
      }
    }

    // スポット名を取得
    let spotName: string | undefined;
    if (payload.spot_id) {
      const { data: spot, error: spotError } = await supabase
        .from("user_spots")
        .select("custom_name")
        .eq("id", payload.spot_id)
        .single();

      console.log("[send-push-notification] Spot query:", {
        spot_id: payload.spot_id,
        spot,
        error: spotError,
      });

      spotName = spot?.custom_name;
    }

    // マップ名を取得
    let mapName: string | undefined;
    if (payload.map_id) {
      const { data: map, error: mapError } = await supabase
        .from("maps")
        .select("name")
        .eq("id", payload.map_id)
        .single();

      console.log("[send-push-notification] Map query:", {
        map_id: payload.map_id,
        map,
        error: mapError,
      });

      mapName = map?.name;
    }

    // メッセージ生成
    const { title, body: messageBody } = generateNotificationMessage(
      payload.type,
      actorName,
      spotName,
      mapName
    );

    // 未読通知数を取得してバッジに設定
    const { count: unreadCount } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", payload.user_id)
      .eq("is_read", false);

    // Expo Push メッセージ構築
    const message: ExpoPushMessage = {
      to: recipient.push_token,
      title,
      body: messageBody,
      data: {
        type: payload.type,
        notificationId: payload.notification_id,
        ...(payload.spot_id && { spotId: payload.spot_id }),
        ...(payload.map_id && { mapId: payload.map_id }),
        ...(payload.actor_id && { userId: payload.actor_id }),
      },
      sound: "default",
      badge: unreadCount ?? 1,
    };

    console.log("[send-push-notification] Sending:", message);

    // Expo Push API に送信
    const pushResponse = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const pushResult = await pushResponse.json();
    console.log("[send-push-notification] Expo response:", pushResult);

    // エラーチェック
    if (pushResult.data?.status === "error") {
      console.error("[send-push-notification] Push error:", pushResult.data);

      // 無効なトークンの場合はDBから削除
      if (
        pushResult.data.details?.error === "DeviceNotRegistered" ||
        pushResult.data.details?.error === "InvalidCredentials"
      ) {
        await supabase
          .from("users")
          .update({ push_token: null, push_token_updated_at: new Date().toISOString() })
          .eq("id", payload.user_id);
        console.log(
          "[send-push-notification] Removed invalid token for user:",
          payload.user_id
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: pushResult,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[send-push-notification] Exception:", error);
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
