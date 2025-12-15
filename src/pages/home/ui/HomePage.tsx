/**
 * ホームページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * おすすめ・フォロー中のマップフィードを提供（検索バーなし）
 */

import React, { useState } from 'react';
import { View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DiscoverTabs, type DiscoverTabMode } from '@/widgets/discover-tabs';
import { RecommendMapFeed } from '@/widgets/recommend-map-feed';
import { FollowingMapFeed } from '@/widgets/following-map-feed';
import { colors } from '@/shared/config';

export function HomePage() {
  const router = useRouter();
  const [tabMode, setTabMode] = useState<DiscoverTabMode>('recommend');

  const handleMapPress = () => {
    router.push('/(tabs)/home/default-map');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['top']}>
      {/* ヘッダー: 街コレアイコン + マップボタン */}
      <View className="flex-row items-center justify-between px-4" style={{ height: 40 }}>
        {/* 左側スペーサー */}
        <View style={{ width: 32 }} />

        {/* 中央: 街コレアイコン */}
        <Image
          source={require('@assets/images/machikore8.png')}
          style={{ width: 180, height: 48 }}
          resizeMode="contain"
        />

        {/* 右側: マップアイコン */}
        <Pressable onPress={handleMapPress} className="p-1">
          <Ionicons
            name="map-outline"
            size={24}
            color={colors.primary.DEFAULT}
          />
        </Pressable>
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
