/**
 * マップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * デフォルトマップまたはカスタムマップを表示
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/entities/user';
import { useMapStore } from '@/entities/map';
import { DefaultMap } from '@/widgets/default-map';
import { MapHierarchy } from '@/widgets/map-hierarchy';
import { UserMap } from '@/widgets/user-map';
import { MapList } from '@/widgets/map-list';
import { MapSearchFullscreen } from '@/widgets/map-search';
import { MapHeader } from '@/widgets/map-header';
import { MapControls } from '@/widgets/map-controls';
import { CreatePostModal } from '@/widgets/create-post';
import { type MapListViewMode } from '@/features/toggle-view-mode';
import { FAB } from '@/shared/ui';
import { colors } from '@/shared/config';

export function MapPage() {
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const resetToDefault = useMapStore((state) => state.resetToDefault);
  const [viewMode, setViewMode] = useState<MapListViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isCustomMap = selectedMapId !== null;

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* ヘッダー */}
      <MapHeader
        isCustomMap={isCustomMap}
        userName={user?.display_name ?? undefined}
        userAvatarUrl={user?.avatar_url ?? undefined}
        onLogoPress={resetToDefault}
      />

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
              {/* デフォルトマップ or カスタムマップ */}
              {isCustomMap ? <UserMap /> : <DefaultMap />}

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
          <MapSearchFullscreen
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
            {isCustomMap ? <MapList /> : <MapHierarchy />}
          </View>
        )
      )}

      {/* 投稿ボタン */}
      <FAB
        onPress={() => setIsModalVisible(true)}
        icon="create-outline"
        color={colors.primary.DEFAULT}
      />

      {/* 投稿作成モーダル */}
      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}
