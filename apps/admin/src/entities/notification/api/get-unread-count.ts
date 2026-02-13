import { createBrowserClient } from "@/shared/api/supabase/client";

/**
 * 未読通知数を取得（RPC）
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc(
    "get_admin_unread_notification_count"
  );

  if (error) {
    console.error("Failed to fetch unread count:", error);
    return 0;
  }

  return data ?? 0;
}
