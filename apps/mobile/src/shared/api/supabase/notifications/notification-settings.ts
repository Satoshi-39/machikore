/**
 * 通知設定API
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { NotificationSettings, UpdateNotificationSettingsParams } from './types';

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
