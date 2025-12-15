/**
 * ホームページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * おすすめ・フォロー中のマップフィードを提供（検索バーなし）
 */

import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscoverTabs, type DiscoverTabMode } from '@/widgets/discover-tabs';
import { RecommendMapFeed } from '@/widgets/recommend-map-feed';
import { FollowingMapFeed } from '@/widgets/following-map-feed';

export function HomePage() {
  const [tabMode, setTabMode] = useState<DiscoverTabMode>('recommend');

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* ヘッダー: 街コレアイコン */}
      <View className="items-center justify-center" style={{ height: 40 }}>
        <Image
          source={require('@assets/images/machikore8.png')}
          style={{ width: 180, height: 48 }}
          resizeMode="contain"
        />
      </View>

      {/* タブ */}
      <DiscoverTabs tabMode={tabMode} onTabModeChange={setTabMode} />

      {/* タブコンテンツ */}
      <View className="flex-1">
        {tabMode === 'recommend' && <RecommendMapFeed />}
        {tabMode === 'following' && <FollowingMapFeed />}
      </View>
    </SafeAreaView>
  );
}
