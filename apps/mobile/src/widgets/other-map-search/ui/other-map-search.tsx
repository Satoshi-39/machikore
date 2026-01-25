/**
 * 他人のマップ全画面検索Widget
 * そのマップのスポットのみを検索
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_COLORS, getSpotColorStroke, DEFAULT_SPOT_COLOR } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Loading, EmptyState, ErrorView, SearchBar, LocationPinIcon } from '@/shared/ui';
import { searchSpotsByMapId, type MapSpotSearchResult } from '@/shared/api/supabase/user-spots';
import { useSearchHistory, SearchHistoryList } from '@/features/search';
import { useI18n } from '@/shared/lib/i18n';
import { extractAddress } from '@/shared/lib/utils/multilang.utils';

interface OtherMapSearchProps {
  mapId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onSpotSelect?: (spot: MapSpotSearchResult) => void;
}

export function OtherMapSearch({
  mapId,
  searchQuery,
  onSearchChange,
  onClose,
  onSpotSelect,
}: OtherMapSearchProps) {
  const isDarkMode = useIsDarkMode();
  const { locale } = useI18n();
  const [results, setResults] = useState<MapSpotSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 検索履歴フック
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  } = useSearchHistory('userMap');

  // 検索実行
  const search = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !mapId) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await searchSpotsByMapId(mapId, trimmedQuery);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('検索に失敗しました'));
    } finally {
      setIsLoading(false);
    }
  }, [mapId]);

  // 検索結果選択時
  const handleSpotSelect = (spot: MapSpotSearchResult) => {
    addHistory(searchQuery);
    onSpotSelect?.(spot);
    onClose();
  };

  // 履歴から検索
  const handleHistorySelect = (query: string) => {
    onSearchChange(query);
  };

  // 検索クエリが変更されたら検索を実行（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search]);

  return (
    <View className="flex-1 bg-surface">
      {/* 検索バー */}
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        onCancel={onClose}
        placeholder="このマップのスポットを検索"
        autoFocus
        showCancelButton
      />

      {/* 検索結果・履歴エリア */}
      <ScrollView className="flex-1">
        {searchQuery.length === 0 ? (
          // 検索履歴
          <View className="p-4">
            <SearchHistoryList
              history={history}
              onSelect={handleHistorySelect}
              onRemove={removeHistory}
              onClearAll={clearHistory}
            />
          </View>
        ) : (
          // 検索結果
          <View className="p-4">
            {isLoading || !hasSearched ? (
              <Loading variant="inline" message="検索中..." />
            ) : error ? (
              <ErrorView
                variant="inline"
                error="検索に失敗しました。もう一度お試しください。"
              />
            ) : results.length === 0 ? (
              <EmptyState
                variant="inline"
                icon="🔍"
                message={`"${searchQuery}" の検索結果が見つかりませんでした`}
              />
            ) : (
              // 検索結果リスト
              <>
                <Text className="text-sm text-on-surface-variant mb-3">
                  "{searchQuery}" の検索結果 ({results.length}件)
                </Text>
                {results.map((spot) => (
                  <Pressable
                    key={spot.id}
                    onPress={() => handleSpotSelect(spot)}
                    className="flex-row items-center py-3 border-b border-outline-variant active:bg-surface-variant"
                  >
                    <View className="w-10 h-10 rounded-full items-center justify-center bg-secondary">
                      <LocationPinIcon
                        size={24}
                        color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
                        strokeColor={getSpotColorStroke(DEFAULT_SPOT_COLOR, isDarkMode)}
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-base text-on-surface font-medium">{spot.name}</Text>
                      {spot.address && (
                        <Text className="text-sm text-on-surface-variant mt-0.5" numberOfLines={1}>
                          {extractAddress(spot.address, locale)}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                  </Pressable>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
