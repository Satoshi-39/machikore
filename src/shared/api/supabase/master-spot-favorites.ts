/**
 * Supabase Master Spot Favorites API
 * マスタースポットのお気に入り機能（デフォルトマップ専用）
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export interface MasterSpotFavorite {
  id: string;
  user_id: string;
  master_spot_id: string;
  created_at: string;
}

// ===============================
// お気に入り操作
// ===============================

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

  // お気に入り数をインクリメント
  await supabase.rpc('increment_master_spot_favorites_count', { master_spot_id: masterSpotId });

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

  // お気に入り数をデクリメント
  await supabase.rpc('decrement_master_spot_favorites_count', { master_spot_id: masterSpotId });
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
