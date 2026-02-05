/**
 * 通知の型定義
 */

import type { Database, Json } from '@/shared/types/database.types';

// 通知タイプ
export type NotificationType =
  | 'like_spot'
  | 'like_map'
  | 'comment_spot'
  | 'comment_map'
  | 'reply_spot'
  | 'reply_map'
  | 'follow'
  | 'system';

// 通知レコード（DBの型）
export interface NotificationRow {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  user_spot_id: string | null;
  map_id: string | null;
  comment_id: string | null;
  content: string | null;
  is_read: boolean;
  created_at: string;
}

// 通知詳細（JOINされたデータ）
export interface NotificationWithDetails extends NotificationRow {
  actor?: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    avatar_crop: Json | null;
  } | null;
  spot?: {
    id: string;
    description: string;
    master_spot?: {
      name: string;
    } | null;
  } | null;
  map?: {
    id: string;
    name: string;
  } | null;
  comment?: {
    id: string;
    content: string;
  } | null;
}

// システムお知らせ（Database型から取得）
export type SystemAnnouncement =
  Database['public']['Tables']['system_announcements']['Row'];

// 通知設定
export interface NotificationSettings {
  id: string;
  user_id: string;
  // プッシュ通知設定
  push_enabled: boolean;
  like_enabled: boolean;
  comment_enabled: boolean;
  follow_enabled: boolean;
  system_enabled: boolean;
  // メール通知設定
  email_enabled: boolean;
  email_like_enabled: boolean;
  email_comment_enabled: boolean;
  email_follow_enabled: boolean;
  email_system_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationSettingsParams {
  // プッシュ通知設定
  push_enabled?: boolean;
  like_enabled?: boolean;
  comment_enabled?: boolean;
  follow_enabled?: boolean;
  system_enabled?: boolean;
  // メール通知設定
  email_enabled?: boolean;
  email_like_enabled?: boolean;
  email_comment_enabled?: boolean;
  email_follow_enabled?: boolean;
  email_system_enabled?: boolean;
}
