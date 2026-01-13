/**
 * 検索履歴フック（Supabase統合版）
 *
 * すべての検索履歴をSupabaseで管理
 */

import { useState, useEffect, useCallback } from 'react';
import { useCurrentUser } from '@/entities/user';
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  type SearchHistoryType,
  type SearchHistoryItem,
} from '@/shared/api/supabase/search-history';

/**
 * useSearchHistoryの戻り値
 */
export interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  isLoading: boolean;
  addHistory: (query: string) => Promise<void>;
  removeHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * 検索履歴フック
 * @param type 検索タイプ（discover, defaultMap, userMap）
 */
export function useSearchHistory(type: SearchHistoryType): UseSearchHistoryReturn {
  const user = useCurrentUser();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 履歴を読み込み
  const loadHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getSearchHistory(type);
      setHistory(data);
    } finally {
      setIsLoading(false);
    }
  }, [user, type]);

  // 初回読み込み & ユーザー/タイプ変更時
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 履歴を追加
  const addHistoryHandler = useCallback(async (query: string) => {
    if (!user || !query.trim()) return;

    await addSearchHistory(query.trim(), type);
    await loadHistory(); // 再読み込み
  }, [user, type, loadHistory]);

  // 履歴を削除
  const removeHistoryHandler = useCallback(async (id: string) => {
    if (!user) return;

    await removeSearchHistory(id);
    await loadHistory(); // 再読み込み
  }, [user, loadHistory]);

  // 履歴を全削除
  const clearHistoryHandler = useCallback(async () => {
    if (!user) return;

    await clearSearchHistory(type);
    setHistory([]);
  }, [user, type]);

  return {
    history,
    isLoading,
    addHistory: addHistoryHandler,
    removeHistory: removeHistoryHandler,
    clearHistory: clearHistoryHandler,
    refresh: loadHistory,
  };
}

/**
 * Discover検索履歴フック（useSearchHistoryのエイリアス）
 */
export function useDiscoverSearchHistory(): UseSearchHistoryReturn {
  return useSearchHistory('discover');
}
