/**
 * Supabase Notifications API
 * 通知機能
 */

import { supabase } from './client';

// 通知タイプ
export type NotificationType =
  | 'like_spot'
  | 'like_map'
  | 'comment_spot'
  | 'comment_map'
  | 'follow'
  | 'system';

// 通知レコード（DBの型）
export interface NotificationRow {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  spot_id: string | null;
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
  } | null;
  spot?: {
    id: string;
    custom_name: string | null;
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

// システムお知らせ
export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'update' | 'maintenance' | 'promotion';
  is_active: boolean;
  published_at: string;
  expires_at: string | null;
  created_at: string;
}

// ===============================
// 通知取得
// ===============================

/**
 * ユーザーの通知一覧を取得
 */
export async function getUserNotifications(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  } = {}
): Promise<NotificationWithDetails[]> {
  const { limit = 50, offset = 0, unreadOnly = false } = options;

  let query = supabase
    .from('notifications')
    .select(`
      id,
      user_id,
      actor_id,
      type,
      spot_id,
      map_id,
      comment_id,
      content,
      is_read,
      created_at,
      actor:users!notifications_actor_id_fkey (
        id,
        username,
        display_name,
        avatar_url
      ),
      spot:user_spots (
        id,
        custom_name,
        master_spot:master_spots (
          name
        )
      ),
      map:maps (
        id,
        name
      ),
      comment:comments (
        id,
        content
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getUserNotifications] Error:', error);
    throw error;
  }

  return (data || []).map((item: any) => ({
    ...item,
    actor: item.actor,
    spot: item.spot,
    map: item.map,
    comment: item.comment,
  }));
}

/**
 * 未読通知数を取得
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('[getUnreadNotificationCount] Error:', error);
    throw error;
  }

  return count ?? 0;
}

// ===============================
// 通知操作
// ===============================

/**
 * 通知を既読にする
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('[markNotificationAsRead] Error:', error);
    throw error;
  }
}

/**
 * 全ての通知を既読にする
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('[markAllNotificationsAsRead] Error:', error);
    throw error;
  }
}

/**
 * 通知を削除
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {
    console.error('[deleteNotification] Error:', error);
    throw error;
  }
}

/**
 * 全ての通知を削除
 */
export async function deleteAllNotifications(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('[deleteAllNotifications] Error:', error);
    throw error;
  }
}

// ===============================
// システムお知らせ
// ===============================

/**
 * アクティブなシステムお知らせを取得
 */
export async function getSystemAnnouncements(): Promise<SystemAnnouncement[]> {
  const { data, error } = await supabase
    .from('system_announcements')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[getSystemAnnouncements] Error:', error);
    throw error;
  }

  return data || [];
}
