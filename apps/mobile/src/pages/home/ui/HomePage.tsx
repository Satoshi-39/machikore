/**
 * ホームページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * おすすめ・フォロー中のマップ+スポット混合フィードを提供（検索バーなし）
 */

import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DiscoverTabs, type DiscoverTabMode } from '@/widgets/discover-tabs';
import { MixedFeed } from '@/widgets/mixed-feed';
import { useI18n } from '@/shared/lib/i18n';

export function HomePage() {
  const [tabMode, setTabMode] = useState<DiscoverTabMode>('recommend');
  const { t } = useI18n();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
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
          <MixedFeed
            tabName="home"
            mode="recommend"
            emptyMessage={t('empty.noContent')}
            emptyIcon="albums-outline"
          />
        )}
        {tabMode === 'following' && (
          <MixedFeed
            tabName="home"
            mode="following"
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
