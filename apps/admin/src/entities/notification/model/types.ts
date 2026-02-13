/**
 * Admin Notification 型定義
 */

/** 通知種別 */
export type AdminNotificationType = "report" | "system" | "inquiry";

/** 通知（既読状態付き） */
export type AdminNotification = {
  id: string;
  type: AdminNotificationType;
  title: string;
  body: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
  is_read: boolean;
};
