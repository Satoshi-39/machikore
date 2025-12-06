/**
 * Supabase認証関連の関数
 *
 * セッション管理はSupabaseクライアントが自動で行う（SecureStorageAdapterを使用）
 * このファイルでは認証関数のみを提供
 */

import { supabase } from './client';
import type { Result } from '@/shared/types';

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

    // セッションはSupabaseクライアントが自動でSecureStoreに保存する

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

    // セッションはSupabaseクライアントが自動でSecureStoreに保存する

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

    // セッションはSupabaseクライアントが自動でSecureStoreから削除する

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
        email: authUser.email || '',
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
        email: authUser.email || '',
        updated_at: now,
      })
      .eq('id', authUser.id);

    if (error) {
      throw error;
    }
  }
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

    // セッションはSupabaseクライアントが自動でSecureStoreに保存する

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

    // セッションはSupabaseクライアントが自動でSecureStoreに保存する

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

    // セッションはSupabaseクライアントが自動でSecureStoreに保存する

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
