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
 * 認証セッションを確認し、期限切れならリフレッシュする
 *
 * system_announcement_reads のRLSは auth.uid() に依存するため、
 * トークン期限切れ時にエラーなしで空配列が返り、全件未読と誤判定される。
 * RLS依存クエリの前にセッションの有効性を保証する。
 */
async function ensureValidSession(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('認証セッションが無効です');
  }

  // トークンの有効期限が30秒以内に切れる場合はリフレッシュ
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at && session.expires_at - now < 30) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw new Error('セッションの更新に失敗しました');
    }
  }
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

  // RLS依存クエリの前に認証セッションを保証
  await ensureValidSession();

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
  // RLS依存クエリの前に認証セッションを保証
  await ensureValidSession();

  const { data, error } = await supabase
    .from('system_announcement_reads')
    .select('announcement_id')
    .eq('user_id', userId);

  if (error) {
    handleSupabaseError('getReadAnnouncementIds', error);
  }

  return new Set((data || []).map((r) => r.announcement_id));
}
