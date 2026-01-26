/**
 * デフォルトマップ全画面検索Widget
 * machis + 全ユーザーのspotsを検索
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizeNum, SPOT_TYPE_COLORS, LOCATION_ICONS } from '@/shared/config';
import { Loading, EmptyState, ErrorView, SearchBar, LocationPinIcon } from '@/shared/ui';
import { useSearchMachikorePlaces, type MachikorePlaceSearchResult } from '@/features/search-places';
import { determineSpotCategory } from '@/entities/master-spot';
import { useSearchHistory, SearchHistoryList } from '@/features/search';

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
  const { results, isLoading, error, hasSearched, search, config } = useSearchMachikorePlaces({
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
  } = useSearchHistory('defaultMap');

  // 検索クエリが変更されたら検索を実行（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, config.debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, config.debounceMs]);

  const handlePlaceSelect = (place: MachikorePlaceSearchResult) => {
    // 検索履歴に追加
    addHistory(searchQuery);
    onPlaceSelect?.(place);
    onClose();
  };

  // 履歴から検索
  const handleHistorySelect = (query: string) => {
    onSearchChange(query);
  };

  return (
    <View className="flex-1 bg-surface">
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
            <Text className="text-lg font-semibold text-on-surface mb-3">街・スポットを検索</Text>
            <Text className="text-sm text-on-surface-variant mb-4">
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
                {results.map((place) => {
                  // タイプ別のスタイル設定（LOCATION_ICONSを使用して統一）
                  const typeConfig = {
                    country: { bgColor: 'bg-white', iconName: null as null, emoji: LOCATION_ICONS.COUNTRY.emoji, iconColor: null, label: '国', labelBg: 'bg-gray-100', labelColor: 'text-gray-700' },
                    region: { bgColor: LOCATION_ICONS.REGION.bgColor, iconName: LOCATION_ICONS.REGION.name, emoji: null as null, iconColor: LOCATION_ICONS.REGION.color, label: '地方', labelBg: 'bg-cyan-100', labelColor: 'text-cyan-700' },
                    prefecture: { bgColor: LOCATION_ICONS.PREFECTURE.bgColor, iconName: LOCATION_ICONS.PREFECTURE.name, emoji: null as null, iconColor: LOCATION_ICONS.PREFECTURE.color, label: '都道府県', labelBg: 'bg-purple-100', labelColor: 'text-purple-700' },
                    city: { bgColor: LOCATION_ICONS.CITY.bgColor, iconName: LOCATION_ICONS.CITY.name, emoji: null as null, iconColor: LOCATION_ICONS.CITY.color, label: '市区', labelBg: 'bg-orange-100', labelColor: 'text-orange-700' },
                    machi: { bgColor: LOCATION_ICONS.MACHI.bgColor, iconName: LOCATION_ICONS.MACHI.name, emoji: null as null, iconColor: LOCATION_ICONS.MACHI.color, label: '街', labelBg: 'bg-green-100', labelColor: 'text-green-700' },
                    spot: { bgColor: 'bg-surface', iconName: 'location' as const, emoji: null as null, iconColor: colors.light.primary, label: 'スポット', labelBg: 'bg-blue-100', labelColor: 'text-blue-700' },
                  };
                  const config = typeConfig[place.type];

                  // スポットの場合はカテゴリカラーを使用
                  const spotCategoryColor = place.type === 'spot'
                    ? SPOT_TYPE_COLORS[determineSpotCategory(place.googleTypes ?? null)]
                    : null;

                  return (
                    <Pressable
                      key={place.id}
                      onPress={() => handlePlaceSelect(place)}
                      className="flex-row items-center py-3 border-b border-outline-variant active:bg-surface-variant"
                    >
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${config.bgColor}`}>
                        {place.type === 'country' && config.emoji ? (
                          <Text style={{ fontSize: fontSizeNum['2xl'] }}>{config.emoji}</Text>
                        ) : place.type === 'spot' ? (
                          <LocationPinIcon size={20} color={spotCategoryColor!} />
                        ) : (
                          <Ionicons
                            name={config.iconName!}
                            size={20}
                            color={config.iconColor!}
                          />
                        )}
                      </View>
                      <View className="flex-1 ml-3">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-base text-on-surface font-medium">{place.name}</Text>
                          <View className={`${config.labelBg} px-2 py-0.5 rounded`}>
                            <Text className={`text-xs ${config.labelColor} font-medium`}>{config.label}</Text>
                          </View>
                        </View>
                        {place.address && (
                          <Text className="text-sm text-on-surface-variant mt-0.5" numberOfLines={1}>
                            {place.address}
                          </Text>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={20} className="text-gray-400" />
                    </Pressable>
                  );
                })}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
