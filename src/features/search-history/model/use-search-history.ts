/**
 * 検索履歴フック
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory,
  type SearchHistoryType,
  type SearchHistoryItem,
} from '../api/search-history-storage';

interface UseSearchHistoryOptions {
  type: SearchHistoryType;
}

interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  isLoading: boolean;
  addHistory: (query: string, resultType?: 'machi' | 'spot' | 'place' | 'city' | 'prefecture' | 'region' | 'country') => Promise<void>;
  removeHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSearchHistory({ type }: UseSearchHistoryOptions): UseSearchHistoryReturn {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 履歴を読み込み
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSearchHistory(type);
      setHistory(data);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  // 初回読み込み
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 履歴を追加
  const addHistory = useCallback(async (query: string, resultType?: 'machi' | 'spot' | 'place' | 'city' | 'prefecture' | 'region' | 'country') => {
    if (!query.trim()) return;
    await addSearchHistory(type, query.trim(), resultType);
    await loadHistory(); // 再読み込み
  }, [type, loadHistory]);

  // 履歴を削除
  const removeHistory = useCallback(async (id: string) => {
    await removeSearchHistory(type, id);
    await loadHistory(); // 再読み込み
  }, [type, loadHistory]);

  // 履歴を全削除
  const clearHistoryHandler = useCallback(async () => {
    await clearSearchHistory(type);
    setHistory([]);
  }, [type]);

  return {
    history,
    isLoading,
    addHistory,
    removeHistory,
    clearHistory: clearHistoryHandler,
    refresh: loadHistory,
  };
}
