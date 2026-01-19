/**
 * 通知操作API
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * 通知を既読にする
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    handleSupabaseError('markNotificationAsRead', error);
  }
}

/**
 * 全ての通知を既読にする
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    handleSupabaseError('markAllNotificationsAsRead', error);
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
    handleSupabaseError('deleteNotification', error);
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
    handleSupabaseError('deleteAllNotifications', error);
  }
}
