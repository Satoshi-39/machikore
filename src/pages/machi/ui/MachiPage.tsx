/**
 * 街ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Breadcrumb } from '@/shared/ui';
import {
  RegionList,
  PrefectureList,
  CityList,
  MachiList,
} from '@/widgets/machi-hierarchy';
import { MachiMap } from '@/widgets/machi-map';
import { MachiSearchFullscreen } from '@/widgets/machi-search';
import {
  ViewModeToggle,
  SearchToggle,
  MachiSearchBar,
  MachiFilterButtons,
  useBreadcrumbItems,
  type MachiFilter,
} from '@/features/machi';
import { useHierarchyNavigation } from '../model/use-hierarchy-navigation';

export type ViewMode = 'map' | 'hierarchy';

export function MachiPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<MachiFilter[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  // 階層ナビゲーション
  const {
    hierarchyState,
    currentLevel,
    handleRegionPress,
    handlePrefecturePress,
    handleCityPress,
    handleBreadcrumbPress,
  } = useHierarchyNavigation();

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  const handleFilterToggle = (filter: MachiFilter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const openSearchBar = () => {
    setIsSearchBarVisible(true);
  };

  const closeSearchBar = () => {
    setIsSearchBarVisible(false);
    setSearchQuery('');
  };

  // viewModeが変更されたら検索バーを閉じる
  useEffect(() => {
    setIsSearchBarVisible(false);
    setSearchQuery('');
  }, [viewMode]);

  // パンくずリストのアイテムを生成
  const breadcrumbItems = useBreadcrumbItems(hierarchyState, handleBreadcrumbPress);

  // 現在表示すべき階層画面を決定
  const renderHierarchyView = () => {
    const { region, prefectureId, cityId } = hierarchyState;

    switch (currentLevel) {
      case 'machi':
        return (
          <MachiList
            region={region!}
            prefectureId={prefectureId!}
            cityId={cityId!}
          />
        );
      case 'city':
        return (
          <CityList
            region={region!}
            prefectureId={prefectureId!}
            onCityPress={handleCityPress}
          />
        );
      case 'prefecture':
        return (
          <PrefectureList
            region={region!}
            onPrefecturePress={handlePrefecturePress}
          />
        );
      case 'region':
      default:
        return <RegionList onRegionPress={handleRegionPress} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {viewMode === 'map' ? (
        // マップ表示：地図全画面 + 上に浮かぶ検索UI
        <View className="flex-1">
          {isSearchFocused ? (
            // 検索フォーカス時：全画面検索UI
            <MachiSearchFullscreen
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={handleSearchClose}
            />
          ) : (
            <>
              <MachiMap />

              {/* 検索バーとフィルターを地図の上に表示 */}
              <View className="absolute top-0 left-0 right-0">
                {/* 検索バー + ViewModeToggle */}
                <View className="flex-row items-start gap-3 px-5 pt-5">
                  <View className="flex-1">
                    <MachiSearchBar onFocus={handleSearchFocus} />
                  </View>
                  <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </View>

                {/* フィルターボタン（画面幅いっぱい） */}
                <View className="px-5 pt-3">
                  <MachiFilterButtons
                    selectedFilters={selectedFilters}
                    onFilterToggle={handleFilterToggle}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        // 階層表示：ヘッダー + 検索バー + 階層ナビゲーション
        <>
          {/* ヘッダー */}
          <View className="bg-white px-5 pt-5 pb-2">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-gray-800">街を探す</Text>
              </View>
              <SearchToggle onPress={openSearchBar} />
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </View>
          </View>

          {/* パンくずリスト（全階層共通、固定高さ） */}
          <Breadcrumb items={breadcrumbItems} />

          {renderHierarchyView()}
        </>
      )}

      {/* オーバーレイ検索バー - 画面全体に表示 */}
      {isSearchBarVisible && viewMode === 'hierarchy' && (
        <>
          {/* 半透明の背景オーバーレイ - 画面全体 */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            activeOpacity={1}
            onPress={closeSearchBar}
          />

          {/* 検索バー */}
          <View
            style={{
              position: 'absolute',
              top: 80, // ヘッダーの下、中央寄りに配置
              left: 20,
              right: 20,
              zIndex: 1000,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
              borderRadius: 12,
            }}
          >
            <View className="bg-white rounded-xl">
              <View className="flex-row items-center px-4 py-3">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 mx-3 text-base text-gray-800"
                  placeholder="地方、都道府県、市区町村、街を検索..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={closeSearchBar}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
