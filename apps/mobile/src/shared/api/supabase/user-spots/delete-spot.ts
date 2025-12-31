/**
 * スポット削除
 */

import { supabase, handleSupabaseError } from '../client';

/**
 * スポットを削除（関連する画像も自動削除される）
 * spots_countはトリガーで自動更新される
 */
export async function deleteSpot(spotId: string): Promise<void> {
  const { error } = await supabase
    .from('user_spots')
    .delete()
    .eq('id', spotId);

  if (error) {
    handleSupabaseError('deleteSpot', error);
  }
}
