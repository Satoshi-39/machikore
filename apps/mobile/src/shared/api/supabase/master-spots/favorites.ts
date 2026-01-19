/**
 * マスタースポットお気に入りAPI
 * デフォルトマップ専用
 * favorites_countはトリガーで自動更新される
 */

import { supabase, handleSupabaseError } from '../client';
import type { MasterSpotFavorite } from './types';

/**
 * マスタースポットをお気に入りに追加
 */
export async function addMasterSpotFavorite(
  userId: string,
  masterSpotId: string
): Promise<MasterSpotFavorite> {
  const { data, error } = await supabase
    .from('master_spot_favorites')
    .insert({
      user_id: userId,
      master_spot_id: masterSpotId,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError('addMasterSpotFavorite', error);
  }

  return data;
}

/**
 * マスタースポットのお気に入りを解除
 */
export async function removeMasterSpotFavorite(
  userId: string,
  masterSpotId: string
): Promise<void> {
  const { error } = await supabase
    .from('master_spot_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('master_spot_id', masterSpotId);

  if (error) {
    handleSupabaseError('removeMasterSpotFavorite', error);
  }
}

/**
 * マスタースポットがお気に入りか確認
 */
export async function checkMasterSpotFavorited(
  userId: string,
  masterSpotId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('master_spot_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('master_spot_id', masterSpotId)
    .maybeSingle();

  if (error) {
    handleSupabaseError('checkMasterSpotFavorited', error);
  }

  return data !== null;
}

/**
 * マスタースポットのお気に入りをトグル
 */
export async function toggleMasterSpotFavorite(
  userId: string,
  masterSpotId: string
): Promise<boolean> {
  const isFavorited = await checkMasterSpotFavorited(userId, masterSpotId);

  if (isFavorited) {
    await removeMasterSpotFavorite(userId, masterSpotId);
    return false;
  } else {
    await addMasterSpotFavorite(userId, masterSpotId);
    return true;
  }
}

/**
 * ユーザーのお気に入りマスタースポットIDリストを取得
 */
export async function getUserFavoriteMasterSpotIds(
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('master_spot_favorites')
    .select('master_spot_id')
    .eq('user_id', userId);

  if (error) {
    handleSupabaseError('getUserFavoriteMasterSpotIds', error);
  }

  return (data || []).map((f) => f.master_spot_id);
}
