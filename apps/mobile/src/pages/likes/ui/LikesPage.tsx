/**
 * いいね一覧ページ
 *
 * FSDの原則：Pageレイヤーは Widgetの組み合わせのみ
 * タブがアクティブな時のみ対応するWidgetをレンダリング（lazy loading）
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useCurrentUserId } from '@/entities/user';
import { LikeTabFilter, type LikeTabMode } from '@/features/filter-like-tab';
import { LikeSpotList, LikeMapList } from '@/widgets/mypage-tab-content';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface LikesPageProps {
  userId?: string;
}

export function LikesPage({ userId: propUserId }: LikesPageProps) {
  const { t } = useI18n();
  const currentUserId = useCurrentUserId();
  const userId = propUserId || currentUserId;
  const [activeTab, setActiveTab] = useState<LikeTabMode>('maps');

  if (!userId) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={t('favorite.likedItems')} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-on-surface-variant">
            {t('common.loginRequired')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('favorite.likedItems')} />
      {/* タブフィルター */}
      <LikeTabFilter tabMode={activeTab} onTabModeChange={setActiveTab} />

      {/* コンテンツ - アクティブタブのWidgetのみレンダリング */}
      {activeTab === 'spots' && <LikeSpotList userId={userId} />}
      {activeTab === 'maps' && <LikeMapList userId={userId} />}
    </View>
  );
}
