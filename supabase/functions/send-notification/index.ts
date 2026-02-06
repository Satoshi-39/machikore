/**
 * 通知送信 Edge Function
 *
 * DBトリガーから呼び出され、プッシュ通知とメール通知を送信
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

// Expo Push API エンドポイント
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

// Resend API エンドポイント
const RESEND_API_URL = "https://api.resend.com/emails";

interface NotificationPayload {
  notification_id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  user_spot_id: string | null;
  map_id: string | null;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data: {
    type: string;
    notificationId: string;
    userSpotId?: string;
    mapId?: string;
    userId?: string;
  };
  sound: "default" | null;
  badge?: number;
}

interface NotificationSettings {
  // プッシュ通知
  push_enabled: boolean;
  like_enabled: boolean;
  comment_enabled: boolean;
  follow_enabled: boolean;
  system_enabled: boolean;
  // メール通知
  email_enabled: boolean;
  email_like_enabled: boolean;
  email_comment_enabled: boolean;
  email_follow_enabled: boolean;
  email_system_enabled: boolean;
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
        title: `${actorName}さんにいいねされました！`,
        body: `${actorName}さんにスポット「${spotName || ""}」をいいねされました。`,
      };
    case "like_map":
      return {
        title: `${actorName}さんにいいねされました！`,
        body: `${actorName}さんにマップ「${mapName || ""}」をいいねされました。`,
      };
    case "comment_spot":
      return {
        title: `${actorName}さんにコメントされました！`,
        body: `${actorName}さんにスポット「${spotName || ""}」にコメントされました。`,
      };
    case "comment_map":
      return {
        title: `${actorName}さんにコメントされました！`,
        body: `${actorName}さんにマップ「${mapName || ""}」にコメントされました。`,
      };
    case "reply_spot":
      return {
        title: `${actorName}さんに返信されました！`,
        body: `${actorName}さんにスポット「${spotName || ""}」で返信されました。`,
      };
    case "reply_map":
      return {
        title: `${actorName}さんに返信されました！`,
        body: `${actorName}さんにマップ「${mapName || ""}」で返信されました。`,
      };
    case "follow":
      return {
        title: `${actorName}さんにフォローされました！`,
        body: `${actorName}さんにフォローされました。`,
      };
    default:
      return {
        title: "お知らせ",
        body: "新しい通知があります",
      };
  }
}

/**
 * 通知タイプ別の設定をチェック（プッシュ通知用）
 */
function isPushNotificationEnabled(type: string, settings: NotificationSettings): boolean {
  if (!settings.push_enabled) return false;

  switch (type) {
    case "like_spot":
    case "like_map":
      return settings.like_enabled;
    case "comment_spot":
    case "comment_map":
    case "reply_spot":
    case "reply_map":
      return settings.comment_enabled;
    case "follow":
      return settings.follow_enabled;
    case "system":
      return settings.system_enabled;
    default:
      return true;
  }
}

/**
 * 通知タイプ別の設定をチェック（メール通知用）
 */
function isEmailNotificationEnabled(type: string, settings: NotificationSettings): boolean {
  // メール通知はシステム通知のみ有効（いいね・コメント・フォローはプッシュ通知で対応）
  // 将来メール通知を再有効化する場合は、このブロックを削除して下のコメントアウトを解除する
  switch (type) {
    case "system":
      return settings.email_system_enabled;
    default:
      return false;
  }

  // --- 将来再有効化用 ---
  // if (!settings.email_enabled) return false;
  //
  // switch (type) {
  //   case "like_spot":
  //   case "like_map":
  //     return settings.email_like_enabled;
  //   case "comment_spot":
  //   case "comment_map":
  //     return settings.email_comment_enabled;
  //   case "follow":
  //     return settings.email_follow_enabled;
  //   case "system":
  //     return settings.email_system_enabled;
  //   default:
  //     return true;
  // }
}

/**
 * メール用HTMLテンプレートを生成
 */
function generateEmailHtml(
  title: string,
  body: string,
  type: string,
  actorInfo: {
    displayName?: string;
    username?: string;
    avatarUrl?: string | null;
  },
  linkInfo: {
    userSpotId?: string | null;
    spotMapId?: string;
    spotOwnerUsername?: string;
    mapId?: string | null;
    mapOwnerUsername?: string;
    actorUsername?: string;
  }
): string {
  // アプリへのリンクを生成
  let actionUrl = "https://machikore.io";
  let actionText = "アプリを開く";

  if (linkInfo.userSpotId && linkInfo.spotOwnerUsername && linkInfo.spotMapId) {
    actionUrl = `https://machikore.io/${linkInfo.spotOwnerUsername}/maps/${linkInfo.spotMapId}/spots/${linkInfo.userSpotId}`;
    actionText = "スポットを見る";
  } else if (linkInfo.mapId && linkInfo.mapOwnerUsername) {
    actionUrl = `https://machikore.io/${linkInfo.mapOwnerUsername}/maps/${linkInfo.mapId}`;
    actionText = "マップを見る";
  } else if (type === "follow" && linkInfo.actorUsername) {
    actionUrl = `https://machikore.io/${linkInfo.actorUsername}`;
    actionText = "プロフィールを見る";
  }

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- ヘッダー -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #eee;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #007AFF;">街コレ</h1>
            </td>
          </tr>

          <!-- メインコンテンツ -->
          <tr>
            <td style="padding: 32px;">
              ${actorInfo.displayName ? `
              <!-- アクター情報 -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    ${actorInfo.avatarUrl
                      ? `<img src="${actorInfo.avatarUrl}" alt="${actorInfo.displayName}" width="48" height="48" style="border-radius: 50%; object-fit: cover; display: block;" />`
                      : `<div style="width: 48px; height: 48px; border-radius: 50%; background-color: #e0e0e0; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 20px; color: #888;">👤</span>
                        </div>`
                    }
                  </td>
                  <td style="vertical-align: middle;">
                    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${actorInfo.displayName}</p>
                    ${actorInfo.username ? `<p style="margin: 2px 0 0; font-size: 13px; color: #888;">@${actorInfo.username}</p>` : ""}
                  </td>
                </tr>
              </table>
              ` : ""}
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: bold; color: #333;">
                ${title}
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #555;">
                ${body}
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #007AFF; border-radius: 8px;">
                    <a href="${actionUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none;">
                      ${actionText}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- フッター -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9f9f9; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #888; text-align: center;">
                このメールは街コレからの通知です
              </p>
              <p style="margin: 0; font-size: 12px; color: #888; text-align: center;">
                通知設定は<a href="https://machikore.io/settings/notifications" style="color: #007AFF;">こちら</a>から変更できます
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Resendでメール送信
 */
async function sendEmail(
  to: string,
  title: string,
  body: string,
  type: string,
  actorInfo: {
    displayName?: string;
    username?: string;
    avatarUrl?: string | null;
  },
  linkInfo: {
    userSpotId?: string | null;
    spotMapId?: string;
    spotOwnerUsername?: string;
    mapId?: string | null;
    mapOwnerUsername?: string;
    actorUsername?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    console.error("[sendEmail] RESEND_API_KEY not configured");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const html = generateEmailHtml(title, body, type, actorInfo, linkInfo);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "街コレ <noreply@machikore.io>",
        to: [to],
        subject: `【街コレ】${title}`,
        html: html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[sendEmail] Resend error:", result);
      return { success: false, error: result.message || "Failed to send email" };
    }

    console.log("[sendEmail] Email sent successfully:", result);
    return { success: true };
  } catch (error) {
    console.error("[sendEmail] Exception:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // リクエストボディを取得
    const body = await req.json();
    console.log("[send-notification] Received:", body);

    // Webhookからのデータ形式を処理
    const payload: NotificationPayload = body.record ? {
      notification_id: body.record.id,
      user_id: body.record.user_id,
      actor_id: body.record.actor_id,
      type: body.record.type,
      user_spot_id: body.record.user_spot_id,
      map_id: body.record.map_id,
    } : body;

    console.log("[send-notification] Parsed payload:", payload);

    // Supabaseクライアント作成
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 受信者の情報を取得（push_token + email）
    const { data: recipient, error: recipientError } = await supabase
      .from("users")
      .select("push_token, email")
      .eq("id", payload.user_id)
      .single();

    if (recipientError) {
      console.error("[send-notification] Failed to get recipient:", recipientError);
      return new Response(
        JSON.stringify({ success: false, reason: "recipient_not_found" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 通知設定を取得
    const { data: notificationSettings } = await supabase
      .from("user_notification_settings")
      .select("push_enabled, like_enabled, comment_enabled, follow_enabled, system_enabled, email_enabled, email_like_enabled, email_comment_enabled, email_follow_enabled, email_system_enabled")
      .eq("user_id", payload.user_id)
      .single();

    // 設定がない場合はデフォルト値
    const settings: NotificationSettings = notificationSettings || {
      push_enabled: true,
      like_enabled: true,
      comment_enabled: true,
      follow_enabled: true,
      system_enabled: true,
      email_enabled: false, // メールはデフォルトOFF
      email_like_enabled: true,
      email_comment_enabled: true,
      email_follow_enabled: true,
      email_system_enabled: true,
    };

    console.log("[send-notification] Notification settings:", settings);

    // アクターの情報を取得
    let actorName = "誰か";
    let actorUsername: string | undefined;
    let actorAvatarUrl: string | null | undefined;
    if (payload.actor_id) {
      const { data: actor } = await supabase
        .from("users")
        .select("display_name, username, avatar_url")
        .eq("id", payload.actor_id)
        .single();

      if (actor?.display_name) {
        actorName = actor.display_name;
      }
      actorUsername = actor?.username;
      actorAvatarUrl = actor?.avatar_url;
    }

    // スポット名を取得
    let spotName: string | undefined;
    let spotMapId: string | undefined;
    let spotOwnerUsername: string | undefined;
    if (payload.user_spot_id) {
      const { data: spot } = await supabase
        .from("user_spots")
        .select("custom_name, map_id, maps(user_id, users(username))")
        .eq("id", payload.user_spot_id)
        .single();

      spotName = spot?.custom_name;
      spotMapId = spot?.map_id;
      spotOwnerUsername = (spot?.maps as any)?.users?.username;
    }

    // マップ名を取得
    let mapName: string | undefined;
    let mapOwnerUsername: string | undefined;
    if (payload.map_id) {
      const { data: map } = await supabase
        .from("maps")
        .select("name, users(username)")
        .eq("id", payload.map_id)
        .single();

      mapName = map?.name;
      mapOwnerUsername = (map?.users as any)?.username;
    }

    // メッセージ生成
    const { title, body: messageBody } = generateNotificationMessage(
      payload.type,
      actorName,
      spotName,
      mapName
    );

    // 結果を格納
    const results: {
      push?: { success: boolean; error?: string };
      email?: { success: boolean; error?: string };
    } = {};

    // ========== プッシュ通知 ==========
    if (recipient?.push_token && isPushNotificationEnabled(payload.type, settings)) {
      // 未読通知数を取得
      const { count: unreadCount } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", payload.user_id)
        .eq("is_read", false);

      const message: ExpoPushMessage = {
        to: recipient.push_token,
        title,
        body: messageBody,
        data: {
          type: payload.type,
          notificationId: payload.notification_id,
          ...(payload.user_spot_id && { userSpotId: payload.user_spot_id }),
          ...(payload.map_id && { mapId: payload.map_id }),
          ...(payload.actor_id && { userId: payload.actor_id }),
        },
        sound: "default",
        badge: unreadCount ?? 1,
      };

      console.log("[send-notification] Sending push:", message);

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
      console.log("[send-notification] Push response:", pushResult);

      if (pushResult.data?.status === "error") {
        results.push = { success: false, error: pushResult.data.details?.error };

        // 無効なトークンの場合はDBから削除
        if (
          pushResult.data.details?.error === "DeviceNotRegistered" ||
          pushResult.data.details?.error === "InvalidCredentials"
        ) {
          await supabase
            .from("users")
            .update({ push_token: null, push_token_updated_at: new Date().toISOString() })
            .eq("id", payload.user_id);
          console.log("[send-notification] Removed invalid push token");
        }
      } else {
        results.push = { success: true };
      }
    } else {
      console.log("[send-notification] Push notification skipped (disabled or no token)");
    }

    // ========== メール通知 ==========
    if (recipient?.email && isEmailNotificationEnabled(payload.type, settings)) {
      console.log("[send-notification] Sending email to:", recipient.email);
      results.email = await sendEmail(
        recipient.email,
        title,
        messageBody,
        payload.type,
        {
          displayName: actorName !== "誰か" ? actorName : undefined,
          username: actorUsername,
          avatarUrl: actorAvatarUrl,
        },
        {
          userSpotId: payload.user_spot_id,
          spotMapId,
          spotOwnerUsername,
          mapId: payload.map_id,
          mapOwnerUsername,
          actorUsername,
        }
      );
    } else {
      console.log("[send-notification] Email notification skipped (disabled or no email)");
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[send-notification] Exception:", error);
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
