/**
 * スポットショート作成
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { SpotShortRow, CreateSpotShortParams } from './types';
import { toSpotShortInsert } from './types';

/**
 * スポットショートを作成
 */
export async function createSpotShort(params: CreateSpotShortParams): Promise<SpotShortRow> {
  const insert = toSpotShortInsert(params);

  const { data, error } = await supabase
    .from('spot_shorts')
    .insert(insert)
    .select()
    .single();

  if (error) {
    log.error('[SpotShorts] 作成エラー:', error);
    throw error;
  }

  log.info('[SpotShorts] 作成成功:', data.id);
  return data;
}

/**
 * 複数のスポットショートを作成
 */
export async function createSpotShorts(
  paramsList: CreateSpotShortParams[]
): Promise<SpotShortRow[]> {
  const inserts = paramsList.map(toSpotShortInsert);

  const { data, error } = await supabase
    .from('spot_shorts')
    .insert(inserts)
    .select();

  if (error) {
    log.error('[SpotShorts] 複数作成エラー:', error);
    throw error;
  }

  log.info('[SpotShorts] 複数作成成功:', data?.length);
  return data || [];
}
