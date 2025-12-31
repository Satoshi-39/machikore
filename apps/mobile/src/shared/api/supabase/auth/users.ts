/**
 * ユーザーテーブル操作
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';

/**
 * public.usersテーブルからユーザー情報を取得
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    log.error('[Auth] Error:', error);
    throw error;
  }

  return data;
}

/**
 * Supabase public.users テーブルにユーザーをupsert
 *
 * 認証時に呼び出し、maps等の外部キー制約を満たす
 * SQLiteへの保存は別途syncUserToSQLiteで行う
 *
 * 重要: 既存ユーザーの場合、avatar_url/display_name/bioは上書きしない
 * （ユーザーが編集した情報をOAuth metadataで上書きしないため）
 */
export async function upsertUserToSupabase(authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}): Promise<void> {
  const metadata = authUser.user_metadata || {};

  // まず既存ユーザーかどうかを確認
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', authUser.id)
    .single();

  const isNewUser = !existingUser;

  // username取得ロジック
  let username = metadata.username;
  if (!username) {
    username = metadata.preferred_username
      || metadata.email?.split('@')[0]
      || authUser.email?.split('@')[0]
      || `user_${authUser.id.slice(0, 8)}`;
  }

  const now = new Date().toISOString();
  // メールアドレスを正規化（小文字+trim）
  const normalizedEmail = (authUser.email || '').toLowerCase().trim();

  if (isNewUser) {
    // 新規ユーザー: OAuthのmetadataからプロフィール情報を設定
    const displayName =
      metadata.display_name ||
      metadata.full_name ||
      metadata.name ||
      username;

    const avatarUrl =
      metadata.avatar_url ||
      metadata.picture ||
      null;

    const { error } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: normalizedEmail,
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: now,
      });

    if (error) {
      throw error;
    }
  } else {
    // 既存ユーザー: email と updated_at のみ更新
    // avatar_url, display_name, bio はユーザーが編集した可能性があるため上書きしない
    const { error } = await supabase
      .from('users')
      .update({
        email: normalizedEmail,
        updated_at: now,
      })
      .eq('id', authUser.id);

    if (error) {
      throw error;
    }
  }
}
