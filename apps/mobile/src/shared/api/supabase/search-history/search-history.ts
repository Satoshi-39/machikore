/**
 * 検索履歴のSupabase操作
 */

import { supabase } from '../client';
import { log } from '@/shared/config/logger';
import type { SearchHistoryItem, SearchHistoryType } from './types';

/**
 * 検索履歴を取得
 */
export async function getSearchHistory(
  searchType: SearchHistoryType = 'discover',
  limit: number = 50
): Promise<SearchHistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('id, query, searched_at')
      .eq('search_type', searchType)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) {
      log.error('[SearchHistory] Failed to get search history:', error);
      return [];
    }

    return (data || []).map((item) => ({
      id: item.id,
      query: item.query,
      timestamp: new Date(item.searched_at).getTime(),
    }));
  } catch (error) {
    log.error('[SearchHistory] Failed to get search history:', error);
    return [];
  }
}

/**
 * 検索履歴を追加（RPC関数を使用）
 */
export async function addSearchHistory(
  query: string,
  searchType: SearchHistoryType = 'discover'
): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('add_search_history', {
      p_query: query,
      p_search_type: searchType,
    });

    if (error) {
      log.error('[SearchHistory] Failed to add search history:', error);
      return null;
    }

    return data;
  } catch (error) {
    log.error('[SearchHistory] Failed to add search history:', error);
    return null;
  }
}

/**
 * 検索履歴を1件削除
 */
export async function removeSearchHistory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('id', id);

    if (error) {
      log.error('[SearchHistory] Failed to remove search history:', error);
      return false;
    }

    return true;
  } catch (error) {
    log.error('[SearchHistory] Failed to remove search history:', error);
    return false;
  }
}

/**
 * 検索履歴を全削除（RPC関数を使用）
 */
export async function clearSearchHistory(
  searchType: SearchHistoryType = 'discover'
): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('clear_search_history', {
      p_search_type: searchType,
    });

    if (error) {
      log.error('[SearchHistory] Failed to clear search history:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    log.error('[SearchHistory] Failed to clear search history:', error);
    return 0;
  }
}
