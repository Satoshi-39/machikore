/**
 * マップ削除
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * マップを削除（関連するスポットも自動削除される）
 */
export async function deleteMap(mapId: string): Promise<void> {
  const { error } = await supabase
    .from('maps')
    .delete()
    .eq('id', mapId);

  if (error) {
    handleSupabaseError('deleteMap', error);
  }
}
