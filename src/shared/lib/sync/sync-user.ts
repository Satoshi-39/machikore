/**
 * Supabase Auth ↔ SQLite users 同期処理
 *
 * 認証時にSupabase Authのユーザー情報をSQLite usersテーブルに同期
 */

import { insertUser, updateUser, getUserById } from '@/shared/api/sqlite';
import { getCurrentUser } from '@/shared/api/supabase/auth';
import type { UserRow } from '@/shared/types/database.types';
import { log } from '@/shared/config/logger';

/**
 * Supabase AuthユーザーをSQLiteに同期
 *
 * ## 呼び出しタイミング
 * - サインアップ時
 * - サインイン時
 * - OAuth認証時
 * - AuthProviderの初期化時（セッション復元）
 *
 * ## 同期内容
 * - Supabase Auth user_metadata → SQLite users
 * - 新規ユーザー: insertUser
 * - 既存ユーザー: updateUser（usernameは保持）
 *
 * @param user - オプション。指定された場合はこのユーザーを使用し、getCurrentUser()を呼ばない
 */
export async function syncUserToSQLite(user?: any): Promise<void> {
  try {
    let supabaseUser = user;

    if (!supabaseUser) {
      supabaseUser = await getCurrentUser();
    }

    if (!supabaseUser) {
      log.warn('[syncUser] Supabaseユーザーが見つかりません');
      return;
    }

    const now = new Date().toISOString();
    const userId = supabaseUser.id;

    // user_metadataから情報取得
    const metadata = supabaseUser.user_metadata || {};

    // OAuth provider別のusername取得ロジック
    let username = metadata.username; // Email/Password認証
    if (!username) {
      // Google: preferred_username, email
      // Apple: email
      username = metadata.preferred_username
        || metadata.email?.split('@')[0]
        || `user_${userId.slice(0, 8)}`;
    }

    // Display name取得（OAuth優先）
    const displayName =
      metadata.display_name ||
      metadata.full_name ||
      metadata.name ||
      username;

    // Avatar URL取得（OAuth優先）
    const avatarUrl =
      metadata.avatar_url ||
      metadata.picture ||
      null;

    // 既存ユーザーを確認
    const existingUser = getUserById(userId);

    if (existingUser) {
      // 既存ユーザーを更新
      updateUser(userId, {
        email: supabaseUser.email || existingUser.email,
        username: existingUser.username, // usernameは変更しない（ユーザーが編集済みの可能性）
        display_name: displayName,
        avatar_url: avatarUrl || existingUser.avatar_url,
        updated_at: now,
      });
    } else {
      // 新規ユーザーを作成
      const newUser: UserRow = {
        id: userId,
        email: supabaseUser.email || '',
        username,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio: null,
        is_premium: 0,
        premium_started_at: null,
        premium_expires_at: null,
        push_token: null,
        push_token_updated_at: null,
        created_at: now,
        updated_at: now,
        synced_at: null,
        is_synced: 0,
      };

      insertUser(newUser);
    }
  } catch (error) {
    log.error('[syncUser] 同期エラー:', error);
    throw error;
  }
}
