/**
 * サインアウト機能のビジネスロジック
 *
 * FSD: features/auth/model
 */

import { useState } from 'react';
import { signOut } from '@/shared/api/supabase/auth';
import { useUserStore } from '@/entities/user';

interface UseSignOutReturn {
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * サインアウト機能のフック
 */
export function useSignOut(): UseSignOutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signOut();

      if (!result.success) {
        throw result.error;
      }

      // ユーザー状態をクリア
      clearUser();

      console.log('[SignOut] サインアウト成功');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'サインアウトに失敗しました';
      setError(errorMessage);
      console.error('[SignOut] サインアウトエラー:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signOut: handleSignOut,
    isLoading,
    error,
  };
}
