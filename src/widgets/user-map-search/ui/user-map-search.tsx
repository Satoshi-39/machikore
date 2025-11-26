/**
 * ユーザーマップ全画面検索Widget
 * 自分のマップ: Google Places APIで新規登録可能
 * 他人のマップ: そのユーザーのspotsのみ検索
 */

import React, { useEffect } from 'react';
import { View, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, ErrorView } from '@/shared/ui';
import {
  useSearchPlaces,
  useSearchMachikorePlaces,
  type PlaceSearchResult,
} from '@/features/search-places';
import { usePlaceSelectHandler } from '../model';
import { useSearchHistory, SearchHistoryList } from '@/features/search-history';

interface UserMapSearchProps {
  mapId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onPlaceSelect?: (place: PlaceSearchResult) => void; // 新規スポットのみ
  currentLocation?: { latitude: number; longitude: number} | null;
  mapUserId?: string | null; // マップの所有者ID
  currentUserId?: string | null; // 現在のユーザーID
}

export function UserMapSearch({
  mapId,
  searchQuery,
  onSearchChange,
  onClose,
  onPlaceSelect,
  currentLocation = null,
  mapUserId = null,
  currentUserId = null,
}: UserMapSearchProps) {
  // 自分のマップかどうか判定
  const isOwnMap = mapUserId === currentUserId;

  // 自分のマップ: Google Places API（新規登録可能）
  const googlePlacesSearch = useSearchPlaces({
    currentLocation,
    minQueryLength: 1,
    debounceMs: 600,
  });

  // 他人のマップ: 街コレデータ（そのユーザーのspotsのみ）
  const machikorePlacesSearch = useSearchMachikorePlaces({
    userId: mapUserId,
    includeAllSpots: false, // 指定ユーザーのspotsのみ
    minQueryLength: 1,
    debounceMs: 300,
  });

  // 使用する検索hookを選択
  const searchHook = isOwnMap ? googlePlacesSearch : machikorePlacesSearch;
  const { results, isLoading, error, search, config } = searchHook;

  // 検索履歴フック
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  } = useSearchHistory({ type: 'userMap' });

  // 検索結果選択ハンドラー（Model層）
  const { handlePlaceSelect: basePlaceSelect } = usePlaceSelectHandler({
    mapId,
    onPlaceSelect,
    onClose,
    endSession: isOwnMap && 'endSession' in googlePlacesSearch ? googlePlacesSearch.endSession : undefined,
  });

  // 検索結果選択時に履歴も追加
  const handlePlaceSelect = (place: PlaceSearchResult | Parameters<typeof basePlaceSelect>[0]) => {
    addHistory(searchQuery, 'place');
    basePlaceSelect(place as PlaceSearchResult);
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

  const handleClose = () => {
    // 自分のマップ（Google Places API使用時）のみセッション終了
    if (isOwnMap && 'endSession' in googlePlacesSearch) {
      googlePlacesSearch.endSession();
    }
    onClose();
  };

  return (
    <View className="flex-1 bg-white">
      {/* 検索バー */}
      <View className="bg-white border-b border-gray-200 px-5 py-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Ionicons name="search" size={20} color={colors.gray[400]} />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-800"
              placeholder={isOwnMap ? 'スポットを検索' : 'このマップのスポットを検索'}
              placeholderTextColor={colors.gray[400]}
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => onSearchChange('')} className="p-1">
                <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
              </Pressable>
            )}
          </View>
          <Pressable onPress={handleClose}>
            <Text className="text-base text-blue-600 font-medium">キャンセル</Text>
          </Pressable>
        </View>
      </View>

      {/* 検索結果・履歴エリア */}
      <ScrollView className="flex-1">
        {searchQuery.length === 0 ? (
          // 検索プレースホルダー + 履歴
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              {isOwnMap ? '場所を検索' : 'このマップのスポットを検索'}
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              {isOwnMap
                ? 'レストラン、カフェ、観光スポットなどを検索して追加できます'
                : 'このマップに登録されているスポットを検索できます'}
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
                <Text className="text-sm text-gray-500 mb-3">
                  "{searchQuery}" の検索結果 ({results.length}件)
                </Text>
                {results.map((place) => (
                  <Pressable
                    key={place.id}
                    onPress={() => handlePlaceSelect(place)}
                    className="flex-row items-center py-3 border-b border-gray-100 active:bg-gray-50"
                  >
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                      <Ionicons name="location" size={20} color={colors.primary.DEFAULT} />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-base text-gray-800 font-medium">{place.name}</Text>
                      {place.address && (
                        <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
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
