/**
 * Google Places API検索hook
 */

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useState, useCallback, useRef } from 'react';
import { searchPlaces } from '../api/search-google-places';
import type { PlacesSearchOptions } from '../api/google-places.types';
import type { PlaceSearchResult } from './types';

interface UseSearchGooglePlacesOptions {
  currentLocation?: { latitude: number; longitude: number } | null;
  minQueryLength?: number; // 最小文字数（デフォルト: 1）
  debounceMs?: number; // デバウンス時間（デフォルト: 600ms）
}

export function useSearchGooglePlaces(options: UseSearchGooglePlacesOptions = {}) {
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

  // Autocomplete Sessionトークン（コスト最適化のため）
  const sessionTokenRef = useRef<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      // クエリが空の場合
      if (!trimmedQuery) {
        setResults([]);
        setIsLoading(false);
        // セッションもクリア
        sessionTokenRef.current = null;
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

      // セッショントークンを生成（検索セッション開始）
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = uuidv4();
        console.log(`🎫 [Autocomplete Session] 新規セッション開始: ${sessionTokenRef.current}`);
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchOptions: PlacesSearchOptions = {
          query: trimmedQuery,
          languageCode: 'ja',
          includedRegionCodes: ['jp'],
          sessionToken: sessionTokenRef.current, // セッショントークンを追加
        };

        // 現在地が利用可能な場合、locationBiasパラメータを追加
        if (currentLocation) {
          searchOptions.locationBias = {
            circle: {
              center: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              },
              radius: 50000, // 50km圏内を優先
            },
          };
        }

        console.log(`🔍 [Google Places API] 検索実行: "${trimmedQuery}" (Session: ${sessionTokenRef.current})`);
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

  /**
   * セッションを終了（場所選択後またはキャンセル時に呼ぶ）
   */
  const endSession = useCallback(() => {
    if (sessionTokenRef.current) {
      console.log(`✅ [Autocomplete Session] セッション終了: ${sessionTokenRef.current}`);
      sessionTokenRef.current = null;
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
    clearCache,
    endSession, // セッション終了関数を公開
    config: { minQueryLength, debounceMs }, // 設定値を公開
  };
}
