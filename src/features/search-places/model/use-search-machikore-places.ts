/**
 * 街コレデータ検索hook
 * SQLiteのmachis + user_spotsを検索
 */

import { useState, useCallback, useRef } from 'react';
import { searchMachikorePlaces, type MachikorePlaceSearchResult, type MachikorePlaceSearchOptions } from '../api/searchMachikorePlaces';

interface UseSearchMachikorePlacesOptions {
  userId?: string | null; // 指定した場合、そのユーザーのspotsのみ検索
  includeAllSpots?: boolean; // trueの場合、全ユーザーのspotsを検索
  minQueryLength?: number; // 最小文字数（デフォルト: 1）
  debounceMs?: number; // デバウンス時間（デフォルト: 300ms）
}

export function useSearchMachikorePlaces(options: UseSearchMachikorePlacesOptions = {}) {
  const {
    userId,
    includeAllSpots = false,
    minQueryLength = 1,
    debounceMs = 300,
  } = options;

  const [results, setResults] = useState<MachikorePlaceSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 簡易キャッシュ（同じクエリの重複検索を防ぐ）
  const cacheRef = useRef<Map<string, MachikorePlaceSearchResult[]>>(new Map());

  const search = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      // クエリが空の場合
      if (!trimmedQuery) {
        setResults([]);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }

      // 最小文字数チェック
      if (trimmedQuery.length < minQueryLength) {
        setResults([]);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }

      // キャッシュキーを生成（ユーザーID + クエリ）
      const cacheKey = `${userId || 'all'}_${includeAllSpots}_${trimmedQuery}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setResults(cached);
        setIsLoading(false);
        setHasSearched(true);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const searchOptions: MachikorePlaceSearchOptions = {
          query: trimmedQuery,
          userId,
          includeAllSpots,
          limit: 20,
        };

        const searchResults = await searchMachikorePlaces(searchOptions);

        // 結果をキャッシュに保存（最大100件まで）
        if (cacheRef.current.size >= 100) {
          // 古いキャッシュを削除（FIFO）
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey) {
            cacheRef.current.delete(firstKey);
          }
        }
        cacheRef.current.set(cacheKey, searchResults);

        setResults(searchResults);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('検索に失敗しました');
        setError(error);
        console.error('街コレ検索エラー:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, includeAllSpots, minQueryLength]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
    clearCache,
    config: { minQueryLength, debounceMs },
  };
}
