/**
 * セッション管理
 */

import { supabase } from '../client';
import type { Result } from '@/shared/types';

/**
 * サインアウト
 */
export async function signOut(): Promise<Result<void>> {
  try {
    const { error } = await supabase.auth.signOut();

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

/**
 * 現在のユーザーを取得
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
