/**
 * 発見ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * 検索機能を提供
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DiscoverSearch } from '@/widgets/discover-search';

export function DiscoverPage() {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClose = () => {
    setIsSearchFocused(false);
  };

  const handleMapPress = () => {
    router.push('/(tabs)/discover/default-map');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* 検索バー */}
      <DiscoverSearch
        onFocus={handleSearchFocus}
        onClose={handleSearchClose}
        isSearchFocused={isSearchFocused}
        onMapPress={handleMapPress}
      />

      {/* 検索がフォーカスされていない時のコンテンツ（後で追加予定） */}
      {!isSearchFocused && (
        <View className="flex-1">
          {/* TODO: 検索以外のコンテンツをここに追加 */}
        </View>
      )}
    </SafeAreaView>
  );
}
