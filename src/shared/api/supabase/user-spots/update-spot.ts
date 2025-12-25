/**
 * スポット更新
 * 言語はマップから継承されるため、スポット単体では言語検出しない
 */

import { supabase, handleSupabaseError } from '../client';
import type { UpdateSpotInput, UserSpotRow } from './types';

/**
 * スポットを更新（user_spotのカスタマイズ可能フィールドのみ）
 */
export async function updateSpot(input: UpdateSpotInput): Promise<UserSpotRow> {
  const { id, ...updateData } = input;

  const { data, error } = await supabase
    .from('user_spots')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    handleSupabaseError('updateSpot', error);
  }

  return data;
}
