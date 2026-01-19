/**
 * プッシュトークンAPI
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * プッシュトークンを保存
 */
export async function updatePushToken(token: string): Promise<void> {
  const { error } = await supabase.rpc('update_push_token', { token });
  if (error) {
    handleSupabaseError('updatePushToken', error);
  }
}

/**
 * プッシュトークンをクリア
 */
export async function clearPushToken(): Promise<void> {
  const { error } = await supabase.rpc('clear_push_token');
  if (error) {
    handleSupabaseError('clearPushToken', error);
  }
}
