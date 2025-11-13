/**
 * サインアップ機能のビジネスロジック
 *
 * FSD: features/auth-sign-up/model
 */

import { useState } from 'react';
import { signUpWithEmail } from '@/shared/api/supabase/auth';

interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

interface UseSignUpReturn {
  signUp: (data: SignUpFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * サインアップ機能のフック
 */
export function useSignUp(): UseSignUpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUpWithEmail(
        data.email,
        data.password,
        data.username
      );

      if (!result.success) {
        throw result.error;
      }

      console.log('[SignUp] サインアップ成功:', result.data.userId);

      // AuthProviderのonAuthStateChangeでユーザー情報が自動的に設定される
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'サインアップに失敗しました';
      setError(errorMessage);
      console.error('[SignUp] サインアップエラー:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error,
  };
}
