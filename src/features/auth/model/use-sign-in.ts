/**
 * サインイン機能のビジネスロジック
 *
 * FSD: features/auth-sign-in/model
 */

import { useState } from 'react';
import { signInWithEmail } from '@/shared/api/supabase/auth';
import { log } from '@/shared/config/logger';

interface SignInFormData {
  email: string;
  password: string;
}

interface UseSignInReturn {
  signIn: (data: SignInFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * サインイン機能のフック
 */
export function useSignIn(): UseSignInReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithEmail(data.email, data.password);

      if (!result.success) {
        throw result.error;
      }

      log.info('[Auth] サインイン成功:', result.data.userId);

      // AuthProviderのonAuthStateChangeでユーザー情報が自動的に設定される
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'サインインに失敗しました';
      setError(errorMessage);
      log.error('[Auth] サインインエラー:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    error,
  };
}
