/**
 * スポットショート削除
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';

/**
 * スポットショートを削除
 */
export async function deleteSpotShort(id: string): Promise<void> {
  const { error } = await supabase
    .from('spot_shorts')
    .delete()
    .eq('id', id);

  if (error) {
    log.error('[SpotShorts] 削除エラー:', error);
    throw error;
  }

  log.info('[SpotShorts] 削除成功:', id);
}

/**
 * スポットIDで全ショートを削除
 */
export async function deleteSpotShortsBySpotId(spotId: string): Promise<void> {
  const { error } = await supabase
    .from('spot_shorts')
    .delete()
    .eq('spot_id', spotId);

  if (error) {
    log.error('[SpotShorts] スポット全削除エラー:', error);
    throw error;
  }

  log.info('[SpotShorts] スポット全削除成功:', spotId);
}
