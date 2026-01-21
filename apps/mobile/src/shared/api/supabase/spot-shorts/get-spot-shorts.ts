/**
 * スポットショート取得
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { SpotShortRow } from './types';

/**
 * スポットIDでショート一覧を取得
 */
export async function getSpotShorts(spotId: string): Promise<SpotShortRow[]> {
  const { data, error } = await supabase
    .from('spot_shorts')
    .select('*')
    .eq('spot_id', spotId)
    .order('order_index', { ascending: true });

  if (error) {
    log.error('[SpotShorts] 取得エラー:', error);
    throw error;
  }

  return data || [];
}

/**
 * IDでショートを取得
 */
export async function getSpotShort(id: string): Promise<SpotShortRow | null> {
  const { data, error } = await supabase
    .from('spot_shorts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 見つからない場合
      return null;
    }
    log.error('[SpotShorts] 取得エラー:', error);
    throw error;
  }

  return data;
}

/**
 * ユーザーIDでショート一覧を取得
 */
export async function getUserSpotShorts(userId: string): Promise<SpotShortRow[]> {
  const { data, error } = await supabase
    .from('spot_shorts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    log.error('[SpotShorts] ユーザーショート取得エラー:', error);
    throw error;
  }

  return data || [];
}
