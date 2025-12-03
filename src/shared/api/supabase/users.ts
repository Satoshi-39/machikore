/**
 * Supabase Users API
 * ユーザー関連の操作
 */

import { supabase } from './client';

/**
 * プッシュトークンを保存
 */
export async function updatePushToken(token: string): Promise<void> {
  const { error } = await supabase.rpc('update_push_token', { token });
  if (error) {
    console.error('[updatePushToken] Error:', error);
    throw error;
  }
}

/**
 * プッシュトークンをクリア
 */
export async function clearPushToken(): Promise<void> {
  const { error } = await supabase.rpc('clear_push_token');
  if (error) {
    console.error('[clearPushToken] Error:', error);
    throw error;
  }
}
