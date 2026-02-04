/**
 * Google Places API検索hook
 */

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useState, useCallback, useRef } from 'react';
import { searchPlaces } from '../api/search-google-places';
import { fetchPlaceDetails } from '../api/google-place-details';
import type { PlacesSearchOptions } from '../api/google-places.types';
import type { PlaceAutocompleteSuggestion, PlaceSearchResult } from './types';
import { convertToPlaceResult } from './types';
import { log } from '@/shared/config/logger';

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

  const [results, setResults] = useState<PlaceAutocompleteSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // 検索実行済みフラグ

  // 簡易キャッシュ（同じクエリの重複リクエストを防ぐ）
  const cacheRef = useRef<Map<string, PlaceAutocompleteSuggestion[]>>(new Map());

  // Autocomplete Sessionトークン（コスト最適化のため）
  const sessionTokenRef = useRef<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      // クエリが空の場合
      if (!trimmedQuery) {
        setResults([]);
        setIsLoading(false);
        setHasSearched(false); // 検索リセット
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
        log.debug(`[SearchPlaces] 検索キャッシュ "${trimmedQuery}" (API呼び出しスキップ)`);
        setResults(cached);
        setIsLoading(false);
        setHasSearched(true);
        return;
      }

      // セッショントークンを生成（検索セッション開始）
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = uuidv4();
        log.debug(`[SearchPlaces] Autocomplete Session 新規セッション開始: ${sessionTokenRef.current}`);
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

        log.debug(`[SearchPlaces] Google Places API 検索実行: "${trimmedQuery}" (Session: ${sessionTokenRef.current})`);
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
        setHasSearched(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('検索に失敗しました');
        setError(error);
        log.error('[SearchPlaces] 場所検索エラー:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentLocation, minQueryLength]
  );

  /**
   * 選択したAutocomplete候補のPlace Detailsを取得
   * セッショントークンを渡してセッションを終了する
   */
  const fetchDetails = useCallback(
    async (placeId: string): Promise<PlaceSearchResult> => {
      const details = await fetchPlaceDetails(
        placeId,
        'ja',
        sessionTokenRef.current ?? undefined
      );
      // セッション終了（Place Details取得でセッション完了）
      sessionTokenRef.current = null;
      return convertToPlaceResult(details);
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    log.debug('[SearchPlaces] 検索キャッシュ クリア完了');
  }, []);

  /**
   * セッションを終了（場所選択後またはキャンセル時に呼ぶ）
   */
  const endSession = useCallback(() => {
    if (sessionTokenRef.current) {
      log.debug(`[SearchPlaces] Autocomplete Session セッション終了: ${sessionTokenRef.current}`);
      sessionTokenRef.current = null;
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    hasSearched, // 検索実行済みフラグ（結果表示の判定に使用）
    search,
    fetchDetails, // 選択した候補の詳細を取得
    clearResults,
    clearCache,
    endSession, // セッション終了関数を公開
    config: { minQueryLength, debounceMs }, // 設定値を公開
  };
}
