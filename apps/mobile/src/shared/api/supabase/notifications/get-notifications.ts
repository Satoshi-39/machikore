/**
 * 通知取得API
 */

import { NOTIFICATION, NOTIFICATIONS_PAGE_SIZE } from '@/shared/config';
import { supabase, handleSupabaseError } from '../client';
import type { NotificationWithDetails } from './types';

/**
 * ユーザーの通知一覧を取得（カーソルベースページネーション）
 */
export async function getUserNotifications(
  userId: string,
  options: {
    limit?: number;
    cursor?: string;
    unreadOnly?: boolean;
  } = {}
): Promise<NotificationWithDetails[]> {
  const { limit = NOTIFICATIONS_PAGE_SIZE, cursor, unreadOnly = false } = options;

  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() - NOTIFICATION.RETENTION_DAYS);

  let query = supabase
    .from('notifications')
    .select(
      `
      id,
      user_id,
      actor_id,
      type,
      user_spot_id,
      map_id,
      comment_id,
      content,
      is_read,
      created_at,
      actor:users!notifications_actor_id_fkey (
        id,
        username,
        display_name,
        avatar_url,
        avatar_crop
      ),
      spot:user_spots (
        id,
        description,
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
    `
    )
    .eq('user_id', userId)
    .gte('created_at', retentionDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;

  if (error) {
    handleSupabaseError('getUserNotifications', error);
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
export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() - NOTIFICATION.RETENTION_DAYS);

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .gte('created_at', retentionDate.toISOString());

  if (error) {
    handleSupabaseError('getUnreadNotificationCount', error);
  }

  return count ?? 0;
}
