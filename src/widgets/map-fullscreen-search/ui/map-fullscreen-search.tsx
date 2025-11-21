/**
 * マップ全画面検索Widget
 */

import React, { useEffect } from 'react';
import { View, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, ErrorView } from '@/shared/ui';
import { useSearchPlaces, type PlaceSearchResult } from '@/features/search-places';

interface MapFullscreenSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onPlaceSelect?: (place: PlaceSearchResult) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
}

export function MapFullscreenSearch({
  searchQuery,
  onSearchChange,
  onClose,
  onPlaceSelect,
  currentLocation = null,
}: MapFullscreenSearchProps) {
  const { results, isLoading, error, search, endSession, config } = useSearchPlaces({
    currentLocation,
    minQueryLength: 1, // 1文字から検索可能
    debounceMs: 600, // 600msのデバウンス
  });

  // 検索クエリが変更されたら検索を実行（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, config.debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, config.debounceMs]);

  const handlePlaceSelect = (place: PlaceSearchResult) => {
    endSession(); // セッション終了（コスト最適化）
    onPlaceSelect?.(place);
    onClose();
  };

  const handleClose = () => {
    endSession(); // キャンセル時もセッション終了
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
              placeholder="スポットを検索"
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
          // 検索プレースホルダー
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">場所を検索</Text>
            <Text className="text-sm text-gray-500">
              レストラン、カフェ、観光スポットなどを検索できます
            </Text>
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
