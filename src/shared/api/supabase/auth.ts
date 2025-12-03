/**
 * Supabase認証関連の関数
 */

import * as SecureStore from 'expo-secure-store';
import { supabase } from './client';
import { STORAGE_KEYS } from '@/shared/config';
import type { Result } from '@/shared/types';

// ===============================
// セッション管理
// ===============================

/**
 * セッションをSecureStoreに保存
 */
export async function saveSession(
  accessToken: string,
  refreshToken: string,
  expiresAt: number
): Promise<void> {
  const sessionData = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt,
  };

  await SecureStore.setItemAsync(
    STORAGE_KEYS.USER_SESSION,
    JSON.stringify(sessionData)
  );
}

/**
 * セッションをSecureStoreから復元
 * アクセストークンが期限切れでもリフレッシュトークンで復元を試みる
 */
export async function restoreSession(): Promise<boolean> {
  try {
    const sessionStr = await SecureStore.getItemAsync(
      STORAGE_KEYS.USER_SESSION
    );

    if (!sessionStr) {
      console.log('[restoreSession] セッションが保存されていません');
      return false;
    }

    const session = JSON.parse(sessionStr);

    // refresh_token がなければ復元不可
    if (!session.refresh_token) {
      console.log('[restoreSession] リフレッシュトークンがありません');
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION);
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const isExpired = session.expires_at && session.expires_at <= now;

    if (isExpired) {
      // アクセストークンが期限切れの場合、リフレッシュトークンで更新を試みる
      console.log('[restoreSession] アクセストークン期限切れ、リフレッシュを試行');
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token,
      });

      if (error || !data.session) {
        console.log('[restoreSession] リフレッシュ失敗:', error?.message);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION);
        return false;
      }

      // 新しいセッションを保存
      await saveSession(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at || 0
      );
      console.log('[restoreSession] リフレッシュ成功、新しいセッションを保存');
      return true;
    }

    // 期限内の場合、そのままセッションを設定
    const { error } = await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (error) {
      console.log('[restoreSession] セッション設定失敗:', error.message);
      // 設定に失敗した場合、リフレッシュを試みる
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token,
      });

      if (refreshError || !refreshData.session) {
        console.log('[restoreSession] リフレッシュも失敗:', refreshError?.message);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION);
        return false;
      }

      // 新しいセッションを保存
      await saveSession(
        refreshData.session.access_token,
        refreshData.session.refresh_token,
        refreshData.session.expires_at || 0
      );
      console.log('[restoreSession] リフレッシュ成功');
      return true;
    }

    console.log('[restoreSession] セッション復元成功');
    return true;
  } catch (error) {
    console.error('[restoreSession] エラー:', error);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION);
    return false;
  }
}

/**
 * セッションを削除
 */
export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION);
}

// ===============================
// 認証関数
// ===============================

/**
 * メールアドレスでサインアップ
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
): Promise<Result<{ userId: string }>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.user) {
      return {
        success: false,
        error: new Error('User creation failed'),
      };
    }

    // セッション保存
    if (data.session) {
      await saveSession(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at || 0
      );
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * メールアドレスでサインイン
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<Result<{ userId: string }>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.user) {
      return {
        success: false,
        error: new Error('Sign in failed'),
      };
    }

    // セッション保存
    if (data.session) {
      await saveSession(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at || 0
      );
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * サインアウト
 */
export async function signOut(): Promise<Result<void>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error };
    }

    await clearSession();

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 現在のユーザーを取得
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

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
    console.error('[getUserById] Error:', error);
    throw error;
  }

  return data;
}

/**
 * Supabase public.users テーブルにユーザーをupsert
 *
 * 認証時に呼び出し、maps等の外部キー制約を満たす
 * SQLiteへの保存は別途syncUserToSQLiteで行う
 */
export async function upsertUserToSupabase(authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}): Promise<void> {
  const metadata = authUser.user_metadata || {};

  // username取得ロジック
  let username = metadata.username;
  if (!username) {
    username = metadata.preferred_username
      || metadata.email?.split('@')[0]
      || authUser.email?.split('@')[0]
      || `user_${authUser.id.slice(0, 8)}`;
  }

  // Display name取得
  const displayName =
    metadata.display_name ||
    metadata.full_name ||
    metadata.name ||
    username;

  // Avatar URL取得
  const avatarUrl =
    metadata.avatar_url ||
    metadata.picture ||
    null;

  const now = new Date().toISOString();

  const { error } = await supabase
    .from('users')
    .upsert({
      id: authUser.id,
      email: authUser.email || '',
      username,
      display_name: displayName,
      avatar_url: avatarUrl,
      updated_at: now,
    }, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

  if (error) {
    console.error('[upsertUserToSupabase] Error:', error);
    throw error;
  }

  console.log('[upsertUserToSupabase] User upserted successfully:', authUser.id);
}

/**
 * パスワードリセットメール送信
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<Result<void>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

// ===============================
// 匿名認証（Anonymous Auth）
// ===============================

/**
 * 匿名ユーザーとしてサインイン
 * 無料版ユーザーが初回起動時に自動的に呼ばれる
 */
export async function signInAnonymously(): Promise<Result<{ userId: string }>> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      return { success: false, error };
    }

    if (!data.user) {
      return {
        success: false,
        error: new Error('Anonymous sign in failed'),
      };
    }

    // セッション保存
    if (data.session) {
      await saveSession(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at || 0
      );
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * 匿名ユーザーを登録ユーザーに変換
 * 有料版購入時に呼ばれる
 */
export async function convertAnonymousToRegistered(
  email: string,
  password: string,
  username: string
): Promise<Result<{ userId: string }>> {
  try {
    // 現在のユーザーが匿名ユーザーか確認
    const user = await getCurrentUser();
    if (!user || !user.is_anonymous) {
      return {
        success: false,
        error: new Error('Current user is not anonymous'),
      };
    }

    // ユーザー情報を更新
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        username,
      },
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.user) {
      return {
        success: false,
        error: new Error('User update failed'),
      };
    }

    // 新しいセッション保存
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      await saveSession(
        sessionData.session.access_token,
        sessionData.session.refresh_token,
        sessionData.session.expires_at || 0
      );
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * ユーザーが匿名ユーザーかどうかを確認
 */
export async function isAnonymousUser(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.is_anonymous ?? false;
}

// ===============================
// OAuth認証
// ===============================

/**
 * Googleでサインイン
 */
export async function signInWithGoogle(): Promise<Result<{ url: string }>> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'machikore://auth/callback',
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.url) {
      return {
        success: false,
        error: new Error('OAuth URL not generated'),
      };
    }

    return {
      success: true,
      data: { url: data.url },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Appleでサインイン
 */
export async function signInWithApple(): Promise<Result<{ url: string }>> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'machikore://auth/callback',
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.url) {
      return {
        success: false,
        error: new Error('OAuth URL not generated'),
      };
    }

    return {
      success: true,
      data: { url: data.url },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * OAuthコールバックからセッションを取得
 */
export async function handleOAuthCallback(
  url: string
): Promise<Result<{ userId: string }>> {
  try {
    // URLからフラグメントを取得
    const fragment = url.split('#')[1];
    if (!fragment) {
      return {
        success: false,
        error: new Error('No fragment in callback URL'),
      };
    }

    // フラグメントをパースしてaccess_tokenとrefresh_tokenを取得
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      return {
        success: false,
        error: new Error('Missing tokens in callback URL'),
      };
    }

    // セッションを設定
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      return { success: false, error };
    }

    if (!data.user) {
      return {
        success: false,
        error: new Error('User not found after OAuth'),
      };
    }

    // セッション保存
    if (data.session) {
      await saveSession(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at || 0
      );
    }

    return {
      success: true,
      data: { userId: data.user.id },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}
