/**
 * マップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * selectedMapIdの有無でデフォルトマップ/カスタムマップを切り替え
 * URLクエリパラメータ (?id=xxx) でマップ指定可能（共有用）
 */

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserStore, useUser } from '@/entities/user';
import { useMapStore, useMap, useUserMaps } from '@/entities/map';
import { DefaultMapView } from '@/widgets/default-map-view';
import { DefaultMapHierarchy } from '@/widgets/default-map-hierarchy';
import { CustomMapView } from '@/widgets/custom-map-view';
import { CustomMapList } from '@/widgets/custom-map-list';
import { MapFullscreenSearch } from '@/widgets/map-fullscreen-search';
import { MapHeader } from '@/widgets/map-header';
import { MapControls } from '@/widgets/map-controls';
import { type MapListViewMode } from '@/features/toggle-view-mode';

export function MapPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const { data: selectedMap } = useMap(selectedMapId);
  const { data: userMaps } = useUserMaps(user?.id ?? null);
  const { data: mapOwner } = useUser(selectedMap?.user_id ?? null);
  const [viewMode, setViewMode] = useState<MapListViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // URLクエリパラメータからマップIDを読み取り、グローバルステートに設定
  useEffect(() => {
    if (id) {
      setSelectedMapId(id);
    }
  }, [id, setSelectedMapId]);

  const isCustomMap = !!selectedMapId;

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  const handleCloseCustomMap = () => {
    setSelectedMapId(null);
    router.push('/(tabs)/map');
  };

  const handleMapSelect = (mapId: string) => {
    setSelectedMapId(mapId);
    router.push(`/(tabs)/map?id=${mapId}`);
  };

  const handleUserPress = () => {
    if (selectedMap?.user_id) {
      router.push(`/user/${selectedMap.user_id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* ヘッダー */}
      <MapHeader
        isCustomMap={isCustomMap}
        mapTitle={selectedMap?.name}
        userName={
          (isCustomMap
            ? mapOwner?.display_name
            : user?.display_name) || undefined
        }
        userAvatarUrl={
          (isCustomMap
            ? mapOwner?.avatar_url
            : user?.avatar_url) || undefined
        }
        userId={(isCustomMap ? mapOwner?.id : user?.id) ?? undefined}
        userMaps={userMaps}
        onClose={handleCloseCustomMap}
        onMapSelect={handleMapSelect}
        onUserPress={handleUserPress}
      />

      {viewMode === 'map' ? (
        // マップ表示
        <View className="flex-1">
          {isSearchFocused ? (
            // 検索フォーカス時：全画面検索UI
            <MapFullscreenSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={handleSearchClose}
            />
          ) : (
            <>
              {/* デフォルトマップ or カスタムマップ */}
              {isCustomMap ? <CustomMapView /> : <DefaultMapView />}

              {/* 検索バー + ViewModeToggle をマップの上に表示 */}
              <View className="absolute top-0 left-0 right-0">
                <MapControls
                  variant="map"
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onSearchFocus={handleSearchFocus}
                />
              </View>
            </>
          )}
        </View>
      ) : (
        // リスト表示
        isSearchFocused ? (
          // 検索フォーカス時：全画面検索UI
          <MapFullscreenSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClose={handleSearchClose}
          />
        ) : (
          <View className="flex-1 bg-white">
            {/* 検索バー + ViewModeToggle */}
            <MapControls
              variant="list"
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSearchFocus={handleSearchFocus}
              className="px-5 pt-5 pb-3"
            />

            {/* デフォルトマップの階層リスト or カスタムマップのフラットリスト */}
            {isCustomMap ? <CustomMapList /> : <DefaultMapHierarchy />}
          </View>
        )
      )}
    </SafeAreaView>
  );
}
