/**
 * デフォルトマップ全画面検索Widget
 * machis + 全ユーザーのspotsを検索
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, ErrorView, SearchBar } from '@/shared/ui';
import { useSearchMachikorePlaces, type MachikorePlaceSearchResult } from '@/features/search-places';
import { useSearchHistory, SearchHistoryList } from '@/features/search-history';

interface DefaultMapSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onPlaceSelect?: (place: MachikorePlaceSearchResult) => void;
}

export function DefaultMapSearch({
  searchQuery,
  onSearchChange,
  onClose,
  onPlaceSelect,
}: DefaultMapSearchProps) {
  const { results, isLoading, error, search, config } = useSearchMachikorePlaces({
    includeAllSpots: true, // デフォルトマップ: 全ユーザーのspotsを検索
    minQueryLength: 1,
    debounceMs: 300,
  });

  // 検索履歴フック
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  } = useSearchHistory({ type: 'defaultMap' });

  // 検索クエリが変更されたら検索を実行（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, config.debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, config.debounceMs]);

  const handlePlaceSelect = (place: MachikorePlaceSearchResult) => {
    // 検索履歴に追加
    addHistory(searchQuery, place.type);
    onPlaceSelect?.(place);
    onClose();
  };

  // 履歴から検索
  const handleHistorySelect = (query: string) => {
    onSearchChange(query);
  };

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      {/* 検索バー */}
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        onCancel={onClose}
        placeholder="街・スポットを検索"
        autoFocus
        showCancelButton
      />

      {/* 検索結果エリア */}
      <ScrollView className="flex-1">
        {searchQuery.length === 0 ? (
          // 検索プレースホルダー + 履歴
          <View className="p-4">
            <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-3">街・スポットを検索</Text>
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-4">
              登録されている街や、みんなが投稿したスポットを検索できます
            </Text>
            {/* 検索履歴 */}
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
            {isLoading ? (
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
                <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mb-3">
                  "{searchQuery}" の検索結果 ({results.length}件)
                </Text>
                {results.map((place) => (
                  <Pressable
                    key={place.id}
                    onPress={() => handlePlaceSelect(place)}
                    className="flex-row items-center py-3 border-b border-border-light dark:border-dark-border-light active:bg-background-secondary dark:active:bg-dark-background-secondary"
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${
                      place.type === 'machi' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Ionicons
                        name={place.type === 'machi' ? 'map' : 'location'}
                        size={20}
                        color={place.type === 'machi' ? colors.secondary.DEFAULT : colors.primary.DEFAULT}
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base text-foreground dark:text-dark-foreground font-medium">{place.name}</Text>
                        {place.type === 'machi' && (
                          <View className="bg-green-100 px-2 py-0.5 rounded">
                            <Text className="text-xs text-green-700 font-medium">街</Text>
                          </View>
                        )}
                      </View>
                      {place.address && (
                        <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-0.5" numberOfLines={1}>
                          {place.address}
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
