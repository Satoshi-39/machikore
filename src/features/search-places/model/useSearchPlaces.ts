/**
 * 場所検索hook
 */

import { useState, useCallback, useRef } from 'react';
import { searchPlaces } from '../api/mapboxGeocoding';
import type { PlaceSearchResult, GeocodingSearchOptions } from '../api/types';

interface UseSearchPlacesOptions {
  currentLocation?: { latitude: number; longitude: number } | null;
  minQueryLength?: number; // 最小文字数（デフォルト: 1）
  debounceMs?: number; // デバウンス時間（デフォルト: 600ms）
}

export function useSearchPlaces(options: UseSearchPlacesOptions = {}) {
  const {
    currentLocation,
    minQueryLength = 1,
    debounceMs = 600,
  } = options;

  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 簡易キャッシュ（同じクエリの重複リクエストを防ぐ）
  const cacheRef = useRef<Map<string, PlaceSearchResult[]>>(new Map());

  const search = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      // クエリが空の場合
      if (!trimmedQuery) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // 最小文字数チェック
      if (trimmedQuery.length < minQueryLength) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // キャッシュチェック
      const cached = cacheRef.current.get(trimmedQuery);
      if (cached) {
        console.log(`✅ [検索キャッシュ] "${trimmedQuery}" (API呼び出しスキップ)`);
        setResults(cached);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchOptions: GeocodingSearchOptions = {
          query: trimmedQuery,
          language: 'ja',
          limit: 10,
          country: ['jp'],
          types: ['poi', 'address', 'place'], // POIを優先的に検索
        };

        // 現在地が利用可能な場合、proximityパラメータを追加
        if (currentLocation) {
          searchOptions.proximity = [
            currentLocation.longitude,
            currentLocation.latitude,
          ];
        }

        console.log(`🔍 [Mapbox API] 検索実行: "${trimmedQuery}"`);
        const searchResults = await searchPlaces(searchOptions);

        // 結果をキャッシュに保存（最大100件まで）
        if (cacheRef.current.size >= 100) {
          // 古いキャッシュを削除（FIFO）
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey) {
            cacheRef.current.delete(firstKey);
          }
        }
        cacheRef.current.set(trimmedQuery, searchResults);

        setResults(searchResults);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('検索に失敗しました');
        setError(error);
        console.error('場所検索エラー:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentLocation, minQueryLength]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    console.log('🗑️ [検索キャッシュ] クリア完了');
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
    clearCache,
    config: { minQueryLength, debounceMs }, // 設定値を公開
  };
}
