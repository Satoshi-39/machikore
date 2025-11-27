/**
 * 発見ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * スポット・マップフィードと検索機能を提供
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscoverTabs, type DiscoverTabMode } from '@/widgets/discover-tabs';
import { DiscoverSearch } from '@/widgets/discover-search';
import { SpotFeed } from '@/widgets/spot-feed';
import { MapFeed } from '@/widgets/map-feed';

export function DiscoverPage() {
  const [tabMode, setTabMode] = useState<DiscoverTabMode>('spots');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* 検索バー（常に表示） */}
      <DiscoverSearch
        onFocus={handleSearchFocus}
        onClose={handleSearchClose}
        isSearchFocused={isSearchFocused}
      />

      {/* 検索がフォーカスされていない時はフィードを表示 */}
      {!isSearchFocused && (
        <>
          {/* タブ */}
          <DiscoverTabs tabMode={tabMode} onTabModeChange={setTabMode} />

          {/* タブコンテンツ */}
          <View className="flex-1">
            {tabMode === 'spots' && <SpotFeed />}
            {tabMode === 'maps' && <MapFeed />}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
