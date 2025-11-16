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
import { DefaultMapView } from '@/widgets/default-map-view';
import { DefaultMapHierarchy } from '@/widgets/default-map-hierarchy';
import { CustomMapView } from '@/widgets/custom-map-view';
import { CustomMapList } from '@/widgets/custom-map-list';
import { MapFullscreenSearch } from '@/widgets/map-fullscreen-search';
import { MapHeader } from '@/widgets/map-header';
import { MapControls } from '@/widgets/map-controls';
// import { CreatePostModal } from '@/widgets/post-creation-modal'; // TODO: Spot作成モーダルに変更予定
import { type MapListViewMode } from '@/features/toggle-view-mode';
// import { FAB } from '@/shared/ui'; // TODO: Spot作成ボタン実装時に使用
// import { colors } from '@/shared/config'; // TODO: Spot作成ボタン実装時に使用

export function MapPage() {
  const user = useUserStore((state) => state.user);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const resetToDefault = useMapStore((state) => state.resetToDefault);
  const [viewMode, setViewMode] = useState<MapListViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // const [isModalVisible, setIsModalVisible] = useState(false); // TODO: Spot作成モーダル実装時に復活

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

      {/* スポット作成ボタン（将来実装予定） */}
      {/* TODO: Spot作成モーダル実装時に有効化 */}
      {/* <FAB
        onPress={() => setIsModalVisible(true)}
        icon="create-outline"
        color={colors.primary.DEFAULT}
      /> */}

      {/* スポット作成モーダル（将来実装予定） */}
      {/* TODO: CreateSpotModalに変更 */}
      {/* <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      /> */}
    </SafeAreaView>
  );
}
