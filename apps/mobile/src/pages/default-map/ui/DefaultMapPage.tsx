/**
 * デフォルトマップページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 街コレ全体のスポットを表示するデフォルトマップ
 */

import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '@/entities/user';
import { DefaultMapView } from '@/widgets/default-map-view';
import { DefaultMapList } from '@/widgets/default-map-list';
import { DefaultMapSearch } from '@/widgets/default-map-search';
import type { MapViewHandle } from '@/shared/lib/map';
import { useLocation, useSafeBack } from '@/shared/lib';
import { type MapListViewMode } from '@/features/toggle-view-mode';
import { useSearchResultJump } from '@/features/map-jump';

interface DefaultMapPageProps {
  /** 戻るボタンを表示するか */
  showBackButton?: boolean;
}

export function DefaultMapPage({ showBackButton = false }: DefaultMapPageProps) {
  const insets = useSafeAreaInsets();
  const { goBack } = useSafeBack();

  // 検索結果からのジャンプ処理
  const { jumpToSearchResult } = useSearchResultJump();

  const user = useUserStore((state) => state.user);

  const [viewMode, setViewMode] = useState<MapListViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { location } = useLocation();
  const mapViewRef = useRef<MapViewHandle>(null);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  // クイック検索（カテゴリボタン押下時）
  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchFocused(true);
  };

  return (
    <View className="flex-1">
      {/* マップ表示（常にレンダリング・全画面） */}
      <View className="flex-1">
        <DefaultMapView
          ref={mapViewRef}
          userId={user?.id ?? null}
          currentLocation={location}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearchFocus={handleSearchFocus}
          onQuickSearch={handleQuickSearch}
          isSearchFocused={isSearchFocused}
          showBackButton={showBackButton}
          onBackPress={goBack}
        />

        {/* リスト表示時：マップの上にリストUIをオーバーレイ */}
        {viewMode === 'list' && !isSearchFocused && (
          <View
            className="absolute inset-0 bg-surface"
            style={{ paddingTop: insets.top }}
          >
            <DefaultMapList
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSearchFocus={handleSearchFocus}
            />
          </View>
        )}

        {/* 検索フォーカス時：全画面検索UI（マップの上に重ねる） */}
        {isSearchFocused && (
          <View
            className="absolute inset-0 z-50 bg-surface"
            style={{ paddingTop: insets.top }}
          >
            <DefaultMapSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClose={handleSearchClose}
              onPlaceSelect={jumpToSearchResult}
            />
          </View>
        )}
      </View>
    </View>
  );
}
