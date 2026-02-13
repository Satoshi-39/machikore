import { createBrowserClient } from "@/shared/api/supabase/client";

/**
 * 通知を既読にする
 */
export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from("admin_notification_reads").upsert(
    {
      notification_id: notificationId,
      admin_user_id: user.id,
    },
    { onConflict: "notification_id,admin_user_id" }
  );

  if (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

/**
 * 複数の通知をまとめて既読にする
 */
export async function markAllAsRead(notificationIds: string[]): Promise<void> {
  if (notificationIds.length === 0) return;

  const supabase = createBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const rows = notificationIds.map((id) => ({
    notification_id: id,
    admin_user_id: user.id,
  }));

  const { error } = await supabase
    .from("admin_notification_reads")
    .upsert(rows, { onConflict: "notification_id,admin_user_id" });

  if (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}
