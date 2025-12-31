/**
 * Discover検索履歴フック（Supabase/クラウド同期対応）
 */

import { useState, useEffect, useCallback } from 'react';
import { useCurrentUser } from '@/entities/user';
import {
  getSearchHistoryFromDB,
  addSearchHistoryToDB,
  removeSearchHistoryFromDB,
  clearSearchHistoryFromDB,
  type SearchHistoryItem,
} from '../api/search-history-supabase';

interface UseDiscoverSearchHistoryReturn {
  history: SearchHistoryItem[];
  isLoading: boolean;
  addHistory: (query: string) => Promise<void>;
  removeHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDiscoverSearchHistory(): UseDiscoverSearchHistoryReturn {
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
      const data = await getSearchHistoryFromDB('discover');
      setHistory(data);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 初回読み込み & ユーザー変更時
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 履歴を追加
  const addHistory = useCallback(async (query: string) => {
    if (!user || !query.trim()) return;

    await addSearchHistoryToDB(query.trim(), 'discover');
    await loadHistory(); // 再読み込み
  }, [user, loadHistory]);

  // 履歴を削除
  const removeHistory = useCallback(async (id: string) => {
    if (!user) return;

    await removeSearchHistoryFromDB(id);
    await loadHistory(); // 再読み込み
  }, [user, loadHistory]);

  // 履歴を全削除
  const clearHistoryHandler = useCallback(async () => {
    if (!user) return;

    await clearSearchHistoryFromDB('discover');
    setHistory([]);
  }, [user]);

  return {
    history,
    isLoading,
    addHistory,
    removeHistory,
    clearHistory: clearHistoryHandler,
    refresh: loadHistory,
  };
}
