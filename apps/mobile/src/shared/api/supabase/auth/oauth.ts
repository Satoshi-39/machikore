/**
 * OAuth認証（Google/Apple）
 */

import { supabase } from '../client';
import type { Result } from '@/shared/types';

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
        queryParams: {
          prompt: 'select_account',
        },
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
