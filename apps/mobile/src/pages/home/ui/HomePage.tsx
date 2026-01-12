/**
 * ホームページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * おすすめ・フォロー中のマップフィードを提供（検索バーなし）
 */

import React, { useState, useCallback } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscoverTabs, type DiscoverTabMode } from '@/widgets/discover-tabs';
import { MapFeed } from '@/widgets/map-feed';
import { getPublicMaps, getFollowingUsersMaps } from '@/shared/api/supabase';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { useUserStore } from '@/entities/user';
import { useI18n } from '@/shared/lib/i18n';

export function HomePage() {
  const [tabMode, setTabMode] = useState<DiscoverTabMode>('recommend');
  const currentUser = useUserStore((state) => state.user);
  const userId = currentUser?.id;
  const { t } = useI18n();

  // フォロー中マップ取得関数（userIdをクロージャでキャプチャ）
  const fetchFollowingMaps = useCallback(
    (limit: number, offset: number) => {
      if (!userId) return Promise.resolve([]);
      return getFollowingUsersMaps(userId, limit, offset);
    },
    [userId]
  );

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
        {tabMode === 'recommend' && (
          <MapFeed
            fetchMaps={getPublicMaps}
            queryKey={[...QUERY_KEYS.maps, 'feed', 'recommend']}
            tabName="home"
            emptyMessage={t('empty.noMaps')}
            emptyIcon="map-outline"
          />
        )}
        {tabMode === 'following' && (
          <MapFeed
            fetchMaps={fetchFollowingMaps}
            queryKey={[...QUERY_KEYS.maps, 'feed', 'following', userId]}
            tabName="home"
            emptyMessage={t('empty.noFollowingMaps')}
            emptyIcon="people-outline"
            requireAuth
            unauthMessage={t('empty.noFollowingUsers')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
