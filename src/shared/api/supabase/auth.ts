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
 */
export async function restoreSession(): Promise<boolean> {
  try {
    const sessionStr = await SecureStore.getItemAsync(
      STORAGE_KEYS.USER_SESSION
    );

    if (!sessionStr) {
      return false;
    }

    const session = JSON.parse(sessionStr);
    const now = Math.floor(Date.now() / 1000);

    // セッションの有効期限チェック
    if (session.expires_at && session.expires_at > now) {
      const { error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (!error) {
        return true;
      }
    }

    // 期限切れまたはエラーの場合はセッションを削除
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION);
    return false;
  } catch (error) {
    console.error('Failed to restore session:', error);
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
        redirectTo: 'machilog://auth/callback',
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
        redirectTo: 'machilog://auth/callback',
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
