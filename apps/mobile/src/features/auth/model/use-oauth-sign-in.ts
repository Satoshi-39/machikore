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
import { supabase } from '@/shared/api/supabase/client';
import { checkEmailExists } from '@/shared/api/supabase/users';
import { useI18n } from '@/shared/lib/i18n';

// WebBrowserのセッションを適切に管理
WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = 'google' | 'apple';
type AuthMode = 'signup' | 'signin';

interface OAuthResult {
  status: 'success' | 'cancel' | 'error';
  error?: string;
}

interface UseOAuthSignInProps {
  mode: AuthMode;
}

interface UseOAuthSignInReturn {
  signInWithOAuth: (provider: OAuthProvider) => Promise<OAuthResult>;
  loadingProvider: OAuthProvider | null;
  error: string | null;
}

/**
 * OAuth サインイン機能のフック
 */
export function useOAuthSignIn({ mode }: UseOAuthSignInProps): UseOAuthSignInReturn {
  const { t } = useI18n();
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

        // 4. セッションからユーザー情報を取得して存在チェック
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const email = session.user.email;
          // OAuth認証成功後、public.usersにこのメールが既に登録されていたかをチェック
          // 注意: この時点でauth.usersには登録されているが、public.usersはupsert前なのでチェック可能
          const emailExistsInPublicUsers = await checkEmailExists(email);

          // nullの場合はDB問い合わせに失敗（ネットワークエラー等）
          // チェックをスキップしてログインを通す（認証自体はSupabase Authで完了済み）
          if (emailExistsInPublicUsers !== null) {
            if (mode === 'signup' && emailExistsInPublicUsers) {
              // アカウント作成モードで既存ユーザー → サインアウトしてエラー
              await supabase.auth.signOut();
              const errorMessage = t('auth.emailAlreadyRegistered');
              setError(errorMessage);
              return { status: 'error', error: errorMessage };
            }

            if (mode === 'signin' && !emailExistsInPublicUsers) {
              // ログインモードで新規ユーザー → サインアウトしてエラー
              await supabase.auth.signOut();
              const errorMessage = t('auth.emailNotRegistered');
              setError(errorMessage);
              return { status: 'error', error: errorMessage };
            }
          }
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
