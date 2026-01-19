/**
 * システムお知らせAPI
 */

import { supabase, handleSupabaseError } from '../client';
import type { SystemAnnouncement } from './types';

/**
 * アクティブなシステムお知らせを取得
 * @param userCreatedAt ユーザーの作成日（指定した場合、それ以降のお知らせのみ取得）
 */
export async function getSystemAnnouncements(
  userCreatedAt?: string
): Promise<SystemAnnouncement[]> {
  let query = supabase
    .from('system_announcements')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  // ユーザー作成日以降のお知らせのみ取得
  if (userCreatedAt) {
    query = query.gte('published_at', userCreatedAt);
  }

  const { data, error } = await query.order('published_at', {
    ascending: false,
  });

  if (error) {
    handleSupabaseError('getSystemAnnouncements', error);
  }

  return data || [];
}

/**
 * 未読のお知らせ数を取得
 * @param userCreatedAt ユーザーの作成日（指定した場合、それ以降のお知らせのみカウント）
 */
export async function getUnreadAnnouncementCount(
  userId: string,
  userCreatedAt?: string
): Promise<number> {
  // アクティブなお知らせの総数を取得
  let query = supabase
    .from('system_announcements')
    .select('id')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  // ユーザー作成日以降のお知らせのみカウント
  if (userCreatedAt) {
    query = query.gte('published_at', userCreatedAt);
  }

  const { data: announcements, error: announcementsError } = await query;

  if (announcementsError) {
    handleSupabaseError('getUnreadAnnouncementCount', announcementsError);
  }

  if (!announcements || announcements.length === 0) {
    return 0;
  }

  // ユーザーが既読にしたお知らせIDを取得
  const { data: readAnnouncements, error: readError } = await supabase
    .from('system_announcement_reads')
    .select('announcement_id')
    .eq('user_id', userId);

  if (readError) {
    handleSupabaseError('getUnreadAnnouncementCount', readError);
  }

  const readIds = new Set(
    (readAnnouncements || []).map((r) => r.announcement_id)
  );
  return announcements.filter((a) => !readIds.has(a.id)).length;
}

/**
 * お知らせを既読にする
 */
export async function markAnnouncementAsRead(
  userId: string,
  announcementId: string
): Promise<void> {
  const { error } = await supabase
    .from('system_announcement_reads')
    .upsert(
      { user_id: userId, announcement_id: announcementId },
      { onConflict: 'user_id,announcement_id' }
    );

  if (error) {
    handleSupabaseError('markAnnouncementAsRead', error);
  }
}

/**
 * 全てのお知らせを既読にする
 */
export async function markAllAnnouncementsAsRead(userId: string): Promise<void> {
  const { data: announcements, error: announcementsError } = await supabase
    .from('system_announcements')
    .select('id')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  if (announcementsError) {
    handleSupabaseError('markAllAnnouncementsAsRead', announcementsError);
  }

  if (!announcements || announcements.length === 0) {
    return;
  }

  const records = announcements.map((a) => ({
    user_id: userId,
    announcement_id: a.id,
  }));

  const { error } = await supabase
    .from('system_announcement_reads')
    .upsert(records, { onConflict: 'user_id,announcement_id' });

  if (error) {
    handleSupabaseError('markAllAnnouncementsAsRead', error);
  }
}

/**
 * ユーザーが既読にしたお知らせIDのセットを取得
 */
export async function getReadAnnouncementIds(
  userId: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('system_announcement_reads')
    .select('announcement_id')
    .eq('user_id', userId);

  if (error) {
    handleSupabaseError('getReadAnnouncementIds', error);
  }

  return new Set((data || []).map((r) => r.announcement_id));
}
