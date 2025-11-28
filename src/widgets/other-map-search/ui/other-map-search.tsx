/**
 * 他人のマップ全画面検索Widget
 * そのユーザーのスポットのみを検索
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, ErrorView, SearchBar } from '@/shared/ui';
import { useSearchMachikorePlaces, type MachikorePlaceSearchResult } from '@/features/search-places';
import { useSpotSelectHandler } from '../model';
import { useSearchHistory, SearchHistoryList } from '@/features/search-history';

interface OtherMapSearchProps {
  mapUserId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onSpotSelect?: (spot: MachikorePlaceSearchResult) => void;
}

export function OtherMapSearch({
  mapUserId,
  searchQuery,
  onSearchChange,
  onClose,
  onSpotSelect,
}: OtherMapSearchProps) {
  // 街コレデータ検索（そのユーザーのスポットのみ）
  const { results, isLoading, error, search, config } = useSearchMachikorePlaces({
    userId: mapUserId,
    includeAllSpots: false,
    minQueryLength: 1,
    debounceMs: 300,
  });

  // 検索履歴フック
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  } = useSearchHistory({ type: 'userMap' });

  // 検索結果選択ハンドラー
  const { handleSpotSelect: baseSpotSelect } = useSpotSelectHandler({
    onSpotSelect,
    onClose,
  });

  // 検索結果選択時に履歴も追加
  const handleSpotSelect = (spot: MachikorePlaceSearchResult) => {
    addHistory(searchQuery, 'spot');
    baseSpotSelect(spot);
  };

  // 履歴から検索
  const handleHistorySelect = (query: string) => {
    onSearchChange(query);
  };

  // 検索クエリが変更されたら検索を実行（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, config.debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, config.debounceMs]);

  return (
    <View className="flex-1 bg-white">
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
                <Text className="text-sm text-gray-500 mb-3">
                  "{searchQuery}" の検索結果 ({results.length}件)
                </Text>
                {results.map((spot) => (
                  <Pressable
                    key={spot.id}
                    onPress={() => handleSpotSelect(spot)}
                    className="flex-row items-center py-3 border-b border-gray-100 active:bg-gray-50"
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${
                      spot.type === 'machi' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Ionicons
                        name={spot.type === 'machi' ? 'map' : 'location'}
                        size={20}
                        color={spot.type === 'machi' ? colors.secondary.DEFAULT : colors.primary.DEFAULT}
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base text-gray-800 font-medium">{spot.name}</Text>
                        {spot.type === 'machi' && (
                          <View className="bg-green-100 px-2 py-0.5 rounded">
                            <Text className="text-xs text-green-700 font-medium">街</Text>
                          </View>
                        )}
                      </View>
                      {spot.address && (
                        <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                          {spot.address}
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
