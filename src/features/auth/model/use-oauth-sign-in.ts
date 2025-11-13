/**
 * OAuth サインイン機能のビジネスロジック
 *
 * FSD: features/auth/model
 */

import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  signInWithGoogle,
  signInWithApple,
  handleOAuthCallback,
} from '@/shared/api/supabase/auth';

// WebBrowserのセッションを適切に管理
WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = 'google' | 'apple';

interface OAuthResult {
  status: 'success' | 'cancel' | 'error';
  error?: string;
}

interface UseOAuthSignInReturn {
  signInWithOAuth: (provider: OAuthProvider) => Promise<OAuthResult>;
  loadingProvider: OAuthProvider | null;
  error: string | null;
}

/**
 * OAuth サインイン機能のフック
 */
export function useOAuthSignIn(): UseOAuthSignInReturn {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signInWithOAuth = async (provider: OAuthProvider): Promise<OAuthResult> => {
    setLoadingProvider(provider);
    setError(null);

    try {
      // 1. OAuth URLを取得
      const result =
        provider === 'google'
          ? await signInWithGoogle()
          : await signInWithApple();

      if (!result.success) {
        throw result.error;
      }

      // 2. ブラウザでOAuthページを開く
      const authResult = await WebBrowser.openAuthSessionAsync(
        result.data.url,
        'machikore://auth/callback'
      );

      if (authResult.type === 'success') {
        // 3. コールバックURLからトークンを取得
        const callbackUrl = authResult.url;
        const callbackResult = await handleOAuthCallback(callbackUrl);

        if (!callbackResult.success) {
          throw callbackResult.error;
        }

        // AuthProviderのonAuthStateChangeで自動的にユーザー情報が設定される
        return { status: 'success' };
      } else if (authResult.type === 'cancel') {
        // キャンセルは正常な動作として扱う（エラーではない）
        return { status: 'cancel' };
      } else {
        throw new Error('OAuth認証に失敗しました');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'OAuth認証に失敗しました';
      setError(errorMessage);
      return { status: 'error', error: errorMessage };
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    signInWithOAuth,
    loadingProvider,
    error,
  };
}
