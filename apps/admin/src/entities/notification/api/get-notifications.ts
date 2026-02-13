import { createBrowserClient } from "@/shared/api/supabase/client";
import type { AdminNotification } from "../model/types";

/**
 * 通知一覧を取得（既読状態付き）
 * LEFT JOINの結果有無でis_readを判定
 */
export async function getNotifications(
  limit = 10
): Promise<AdminNotification[]> {
  const supabase = createBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // 管理者の登録日を取得（登録以降の通知のみ表示）
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("created_at")
    .eq("user_id", user.id)
    .single();

  const { data, error } = await supabase
    .from("admin_notifications")
    .select(
      `
      id,
      type,
      title,
      body,
      metadata,
      created_at,
      admin_notification_reads!left(read_at)
    `
    )
    .eq("admin_notification_reads.admin_user_id", user.id)
    .gte("created_at", adminUser?.created_at ?? new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type as AdminNotification["type"],
    title: row.title,
    body: row.body,
    metadata: row.metadata as AdminNotification["metadata"],
    created_at: row.created_at,
    is_read:
      Array.isArray(row.admin_notification_reads) &&
      row.admin_notification_reads.length > 0,
  }));
}
