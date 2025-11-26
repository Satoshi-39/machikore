/**
 * 自分のマップ全画面検索Widget
 * Google Places APIで新規スポットを検索・登録
 */

import React, { useEffect } from 'react';
import { View, TextInput, Pressable, Text, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { Loading, EmptyState, ErrorView } from '@/shared/ui';
import {
  useSearchGooglePlaces,
  useSelectedPlaceStore,
  type PlaceSearchResult,
  type ManualLocationInput,
} from '@/features/search-places';
import { usePlaceSelectHandler } from '../model';
import { useSearchHistory, SearchHistoryList } from '@/features/search-history';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';

interface OwnMapSearchProps {
  mapId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onPlaceSelect?: (place: PlaceSearchResult) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
  onMapPinSelect?: () => void; // 地図上でピン刺しモード開始
}

export function OwnMapSearch({
  mapId,
  searchQuery,
  onSearchChange,
  onClose,
  onPlaceSelect,
  currentLocation = null,
  onMapPinSelect,
}: OwnMapSearchProps) {
  const router = useRouter();
  const setSelectedPlace = useSelectedPlaceStore((state) => state.setSelectedPlace);
  // Google Places API検索
  const { results, isLoading, error, search, config, endSession } = useSearchGooglePlaces({
    currentLocation,
    minQueryLength: 1,
    debounceMs: 600,
  });

  // 検索履歴フック
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  } = useSearchHistory({ type: 'userMap' });

  // 検索結果選択ハンドラー
  const { handlePlaceSelect: basePlaceSelect } = usePlaceSelectHandler({
    mapId,
    onPlaceSelect,
    onClose,
    endSession,
  });

  // 検索結果選択時に履歴も追加
  const handlePlaceSelect = (place: PlaceSearchResult) => {
    addHistory(searchQuery, 'place');
    basePlaceSelect(place);
  };

  // 履歴から検索
  const handleHistorySelect = (query: string) => {
    onSearchChange(query);
  };

  // 現在地を登録
  const handleCurrentLocationRegister = () => {
    if (!currentLocation) {
      Alert.alert('位置情報が取得できません', '位置情報の許可を確認してください');
      return;
    }

    const manualInput: ManualLocationInput = {
      id: Crypto.randomUUID(),
      name: null,
      address: null,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      category: [],
      source: 'current_location',
    };

    endSession();
    setSelectedPlace(manualInput);
    router.push('/create-spot');
  };

  // 地図上でピン刺し
  const handleMapPinRegister = () => {
    endSession();
    onClose();
    onMapPinSelect?.();
  };

  // 検索クエリが変更されたら検索を実行（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, config.debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, config.debounceMs]);

  const handleClose = () => {
    endSession();
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
          // 検索プレースホルダー + 履歴 + 登録オプション
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">場所を検索</Text>
            <Text className="text-sm text-gray-500 mb-4">
              レストラン、カフェ、観光スポットなどを検索して追加できます
            </Text>

            {/* 検索履歴 */}
            <SearchHistoryList
              history={history}
              onSelect={handleHistorySelect}
              onRemove={removeHistory}
              onClearAll={clearHistory}
            />

            {/* 登録オプション（リンク風テキスト） */}
            <View className="mt-6 flex-row items-center justify-center gap-4">
              <Pressable onPress={handleCurrentLocationRegister}>
                <Text className="text-blue-600 text-sm">現在地を登録</Text>
              </Pressable>
              <Text className="text-gray-300">|</Text>
              <Pressable onPress={handleMapPinRegister}>
                <Text className="text-blue-600 text-sm">地図上でピン刺し</Text>
              </Pressable>
            </View>
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
