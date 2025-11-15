/**
 * マップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * ユーザーマップを表示する
 */

import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/entities/user';
import { UserMap } from '@/widgets/user-map';
import { MapList } from '@/widgets/map-list';
import { MapSearchFullscreen } from '@/widgets/map-search';
import {
  MapSearchBar,
  ViewModeToggle,
  MapFilterButtons,
  type ViewMode,
  type MapFilter,
} from '@/features/map';

export function MapPage() {
  const user = useUserStore((state) => state.user);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedFilters, setSelectedFilters] = useState<MapFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleFilterToggle = (filter: MapFilter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* ヘッダー：ロゴ（左）、マップ名（中央）、ユーザーアイコン（右） */}
      <View className="bg-white px-5 py-4">
        <View className="flex-row items-center">
          {/* ロゴ（左端・固定幅） */}
          <View className="flex-row items-center" style={{ width: 80 }}>
            <Ionicons name="map" size={20} color="#007AFF" />
            <Text className="ml-1 text-base font-bold text-blue-500">街コレ</Text>
          </View>

          {/* マップ名（中央） */}
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800">
              {user?.display_name || 'ゲスト'}のマップ
            </Text>
          </View>

          {/* ユーザーアイコン（右端・固定幅） */}
          <View style={{ width: 80 }} className="items-end">
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
                <Text className="text-lg font-bold text-gray-600">
                  {user?.display_name?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {viewMode === 'map' ? (
        // マップ表示
        <View className="flex-1">
          {isSearchFocused ? (
            // 検索フォーカス時：全画面検索UI
            <MapSearchFullscreen
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={handleSearchClose}
            />
          ) : (
            <>
              <UserMap />

              {/* 検索バー + ViewModeToggle + フィルターをマップの上に表示 */}
              <View className="absolute top-0 left-0 right-0">
                {/* 検索バー + ViewModeToggle */}
                <View className="px-5 pt-5">
                  <View className="flex-row items-start gap-3">
                    <View className="flex-1">
                      <MapSearchBar variant="map" onFocus={handleSearchFocus} />
                    </View>
                    <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                  </View>
                </View>

                {/* フィルターボタン */}
                <View className="px-5 pt-3">
                  <MapFilterButtons
                    selectedFilters={selectedFilters}
                    onFilterToggle={handleFilterToggle}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        // リスト表示
        <View className="flex-1 bg-white">
          {isSearchFocused ? (
            // 検索フォーカス時：全画面検索UI
            <MapSearchFullscreen
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={handleSearchClose}
            />
          ) : (
            <>
              {/* 検索バー + ViewModeToggle */}
              <View className="px-5 pt-5 pb-3">
                <View className="flex-row items-start gap-3">
                  <View className="flex-1">
                    <MapSearchBar variant="list" onFocus={handleSearchFocus} />
                  </View>
                  <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </View>
              </View>

              <MapList />
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
