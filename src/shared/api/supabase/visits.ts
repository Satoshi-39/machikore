/**
 * 訪問記録（Visits）関連のSupabase API
 */

import { supabase } from './client';
import type { UUID } from '@/shared/types';

// ===============================
// 訪問記録の取得
// ===============================

/**
 * ユーザーの全訪問記録を取得
 */
export async function getVisitsByUserId(userId: UUID) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .order('visited_at', { ascending: false });

  if (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }

  return data;
}

/**
 * ユーザーと街IDで訪問記録を取得
 */
export async function getVisitByUserAndMachi(userId: UUID, machiId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .eq('machi_id', machiId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found (正常ケース)
    console.error('Error fetching visit:', error);
    throw error;
  }

  return data;
}

/**
 * 街の訪問済み状態をチェック
 */
export async function checkMachiVisited(userId: UUID, machiId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('visits')
    .select('id')
    .eq('user_id', userId)
    .eq('machi_id', machiId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking visit status:', error);
    throw error;
  }

  return !!data;
}

// ===============================
// 訪問記録の作成・削除
// ===============================

/**
 * 訪問記録を作成
 */
export async function createVisit(
  userId: UUID,
  machiId: string,
  visitedAt?: string
): Promise<{ id: string; visited_at: string }> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('visits')
    .insert({
      user_id: userId,
      machi_id: machiId,
      visited_at: visitedAt || now,
    })
    .select('id, visited_at')
    .single();

  if (error) {
    console.error('Error creating visit:', error);
    throw error;
  }

  return data;
}

/**
 * 訪問記録を削除
 */
export async function deleteVisit(userId: UUID, machiId: string): Promise<void> {
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('user_id', userId)
    .eq('machi_id', machiId);

  if (error) {
    console.error('Error deleting visit:', error);
    throw error;
  }
}

/**
 * 訪問状態をトグル（訪問済み↔未訪問）
 * @returns 新しい訪問状態（true = 訪問済み, false = 未訪問）
 */
export async function toggleVisit(
  userId: UUID,
  machiId: string,
  visitedAt?: string
): Promise<boolean> {
  // 現在の状態をチェック
  const isVisited = await checkMachiVisited(userId, machiId);

  if (isVisited) {
    // 訪問済み → 削除
    await deleteVisit(userId, machiId);
    return false;
  } else {
    // 未訪問 → 作成
    await createVisit(userId, machiId, visitedAt);
    return true;
  }
}

// ===============================
// 統計情報
// ===============================

/**
 * ユーザーの総訪問街数を取得
 */
export async function getTotalVisitedMachiCount(userId: UUID): Promise<number> {
  const { count, error } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error counting visits:', error);
    throw error;
  }

  return count || 0;
}

/**
 * ユーザーの訪問済み街IDリストを取得
 */
export async function getVisitedMachiIds(userId: UUID): Promise<string[]> {
  const { data, error } = await supabase
    .from('visits')
    .select('machi_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching visited machi IDs:', error);
    throw error;
  }

  return data?.map(v => v.machi_id) || [];
}
