/**
 * スポット削除
 */

import { supabase, handleSupabaseError } from '../client';
import { log } from '@/shared/config/logger';

/**
 * スポットを削除（関連する画像も自動削除される）
 */
export async function deleteSpot(spotId: string): Promise<void> {
  // まずスポット情報を取得（map_idが必要）
  const { data: spot } = await supabase
    .from('user_spots')
    .select('map_id')
    .eq('id', spotId)
    .single();

  const mapId = spot?.map_id;

  const { error } = await supabase
    .from('user_spots')
    .delete()
    .eq('id', spotId);

  if (error) {
    handleSupabaseError('deleteSpot', error);
  }

  // マップのspots_countをデクリメント
  if (mapId) {
    const { error: rpcError } = await supabase.rpc('decrement_map_spots_count', { map_id: mapId });
    if (rpcError) {
      log.error('[UserSpots] Failed to decrement spots_count:', rpcError);
    }
  }
}
