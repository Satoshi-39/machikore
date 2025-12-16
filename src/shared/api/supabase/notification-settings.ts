/**
 * 通知設定API
 *
 * ユーザーの通知設定を取得・更新
 */

import { supabase } from './client';
import { log } from '@/shared/config/logger';

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

/**
 * 通知設定を取得
 * 設定がない場合はデフォルト値で自動作成
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  const { data, error } = await supabase.rpc('get_notification_settings');

  if (error) {
    log.error('[NotificationSettings] Error:', error);
    throw error;
  }

  return data as NotificationSettings;
}

/**
 * 通知設定を更新
 * @param settings 更新する設定（指定しない項目は現在値を維持）
 */
export async function updateNotificationSettings(
  settings: UpdateNotificationSettingsParams
): Promise<NotificationSettings> {
  const { data, error } = await supabase.rpc('update_notification_settings', {
    // プッシュ通知
    p_push_enabled: settings.push_enabled,
    p_like_enabled: settings.like_enabled,
    p_comment_enabled: settings.comment_enabled,
    p_follow_enabled: settings.follow_enabled,
    p_system_enabled: settings.system_enabled,
    // メール通知
    p_email_enabled: settings.email_enabled,
    p_email_like_enabled: settings.email_like_enabled,
    p_email_comment_enabled: settings.email_comment_enabled,
    p_email_follow_enabled: settings.email_follow_enabled,
    p_email_system_enabled: settings.email_system_enabled,
  });

  if (error) {
    log.error('[NotificationSettings] Error:', error);
    throw error;
  }

  return data as NotificationSettings;
}
