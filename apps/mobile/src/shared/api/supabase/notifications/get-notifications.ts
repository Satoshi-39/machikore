/**
 * 通知取得API
 */

import { supabase, handleSupabaseError } from '../client';
import type { NotificationWithDetails } from './types';

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
        avatar_url
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
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

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
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    handleSupabaseError('getUnreadNotificationCount', error);
  }

  return count ?? 0;
}
