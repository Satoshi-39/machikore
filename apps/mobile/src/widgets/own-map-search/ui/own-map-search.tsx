/**
 * 自分のマップ全画面検索Widget
 * Google Places APIで新規スポットを検索・登録
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Keyboard, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPOT_COLORS, getSpotColorStroke, DEFAULT_SPOT_COLOR, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import { Loading, EmptyState, ErrorView, SearchBar, LocationPinIcon } from '@/shared/ui';
import {
  useSearchGooglePlaces,
  type PlaceSearchResult,
  type PlaceAutocompleteSuggestion,
} from '@/features/search-places';
import { useSpots } from '@/entities/user-spot';
import { usePlaceSelectHandler } from '../model';
import { useSearchHistory, SearchHistoryList } from '@/features/search';
import { useRouter, type Href } from 'expo-router';
import { log } from '@/shared/config/logger';

interface OwnMapSearchProps {
  mapId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onPlaceSelect?: (place: PlaceSearchResult) => void;
  currentLocation?: { latitude: number; longitude: number } | null;
}

export function OwnMapSearch({
  mapId,
  searchQuery,
  onSearchChange,
  onClose,
  onPlaceSelect,
  currentLocation = null,
}: OwnMapSearchProps) {
  const { t } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  // Google Places API検索
  const { results, isLoading, error, hasSearched, search, fetchDetails, config, endSession } = useSearchGooglePlaces({
    currentLocation,
    minQueryLength: 1,
    debounceMs: 600,
  });

  // 自分のマップのスポット（重複チェック用）
  const { data: spots = [] } = useSpots(mapId ?? '', null, true);

  // 検索履歴フック
  const {
    history,
    addHistory,
    removeHistory,
    clearHistory,
  } = useSearchHistory('userMap');

  // 既存スポット編集へ遷移
  const handleExistingSpotEdit = (spotId: string) => {
    router.push(`/edit-spot/${spotId}` as Href);
  };

  // 検索結果選択ハンドラー（Place Details取得後に呼ばれる）
  const { handlePlaceSelect: basePlaceSelect } = usePlaceSelectHandler({
    mapId,
    onPlaceSelect,
    onExistingSpotEdit: handleExistingSpotEdit,
    onClose,
    endSession,
  });

  // Autocomplete候補選択時のハンドラー
  const handleSuggestionSelect = async (suggestion: PlaceAutocompleteSuggestion) => {
    addHistory(searchQuery);

    // Place Details取得前に重複チェック（placeIdだけで判定可能）
    const existingSpot = spots.find(
      (spot) => spot.master_spot?.google_place_id === suggestion.placeId
    );

    if (existingSpot) {
      Alert.alert(
        t('alert.alreadyRegistered'),
        t('alert.alreadyRegisteredMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('alert.editButton'),
            onPress: () => {
              endSession();
              onClose();
              handleExistingSpotEdit(existingSpot.id);
            },
          },
        ]
      );
      return;
    }

    // 新規スポット → Place Details取得（1件のみ）
    setIsFetchingDetails(true);
    try {
      const placeResult = await fetchDetails(suggestion.placeId);
      basePlaceSelect(placeResult);
    } catch (err) {
      log.error('[OwnMapSearch] Place Details取得エラー:', err);
      Alert.alert(t('common.error'), t('alert.fetchDetailsFailed'));
    } finally {
      setIsFetchingDetails(false);
    }
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
    endSession();
    onClose();
  };

  return (
    <View className="flex-1 bg-surface">
      {/* 検索バー */}
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        onCancel={handleClose}
        placeholder={t('search.searchAndRegister')}
        autoFocus
        showCancelButton
      />

      {/* 検索結果・履歴エリア */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
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
            {isLoading || isFetchingDetails ? (
              <Loading variant="inline" message={isFetchingDetails ? t('search.loadingDetails') : t('search.searching')} />
            ) : error ? (
              <ErrorView
                variant="inline"
                error={t('search.searchFailed')}
              />
            ) : hasSearched && results.length === 0 ? (
              <EmptyState
                variant="inline"
                icon="🔍"
                message={t('search.noResultsFor', { query: searchQuery })}
              />
            ) : !hasSearched ? (
              // 検索中（デバウンス待ち）
              <Loading variant="inline" message={t('search.searching')} />
            ) : (
              // 検索結果リスト
              <>
                <Text className="text-sm text-on-surface-variant mb-3">
                  {t('search.resultsFor', { query: searchQuery, count: results.length })}
                </Text>
                {results.map((place) => (
                  <Pressable
                    key={place.placeId}
                    onPress={() => handleSuggestionSelect(place)}
                    className="flex-row items-center py-3 border-b-thin border-outline-variant active:bg-surface-variant"
                  >
                    <View className="w-10 h-10 rounded-full items-center justify-center bg-secondary">
                      <LocationPinIcon
                        size={iconSizeNum.lg}
                        color={SPOT_COLORS[DEFAULT_SPOT_COLOR].color}
                        strokeColor={getSpotColorStroke(DEFAULT_SPOT_COLOR, isDarkMode)}
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-base text-on-surface font-medium">{place.name}</Text>
                      {place.address && (
                        <Text className="text-sm text-on-surface-variant mt-0.5" numberOfLines={1}>
                          {place.address}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={iconSizeNum.md} className="text-gray-400" />
                  </Pressable>
                ))}
              </>
            )}
          </View>
        )}
        </ScrollView>
      </View>
    </View>
  );
}
