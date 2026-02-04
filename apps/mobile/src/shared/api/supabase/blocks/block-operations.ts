/**
 * ブロック操作
 */

import { supabase, handleSupabaseError } from '../client';
import { log } from '@/shared/config/logger';

/**
 * ユーザーをブロックする
 */
export async function blockUser(
  blockerId: string,
  blockedId: string
): Promise<void> {
  if (blockerId === blockedId) {
    throw new Error('Cannot block yourself');
  }

  const { error } = await supabase.from('user_blocks').insert({
    blocker_id: blockerId,
    blocked_id: blockedId,
  });

  if (error) {
    if (error.code === '23505') {
      log.debug('[Blocks] Already blocked');
      return;
    }
    handleSupabaseError('blockUser', error);
  }
}

/**
 * ユーザーのブロックを解除する
 */
export async function unblockUser(
  blockerId: string,
  blockedId: string
): Promise<void> {
  const { error } = await supabase
    .from('user_blocks')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId);

  if (error) {
    handleSupabaseError('unblockUser', error);
  }
}
