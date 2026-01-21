/**
 * スポット記事ページ
 *
 * FSDの原則：PagesレイヤーはWidgetの組み合わせのみ
 * スポットの詳細をブログ形式で紹介
 *
 * TODO: 本格的な実装を追加
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useSpotWithDetails } from '@/entities/user-spot';

interface SpotArticlePageProps {
  spotId: string;
}

export function SpotArticlePage({ spotId }: SpotArticlePageProps) {
  const { t } = useI18n();
  const { data: spot, isLoading } = useSpotWithDetails(spotId);

  // ローディング状態
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      </SafeAreaView>
    );
  }

  // データなし
  if (!spot) {
    return (
      <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
        <PageHeader title={t('article.article')} />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="document-text-outline" size={48} color={colors.gray[300]} />
          <Text className="text-foreground-muted dark:text-dark-foreground-muted mt-4">
            {t('article.notFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-surface" edges={['bottom']}>
      <PageHeader title={t('article.article')} />
      <View className="flex-1 justify-center items-center px-4">
        <Ionicons name="construct-outline" size={48} color={colors.gray[400]} />
        <Text className="text-foreground dark:text-dark-foreground text-lg font-semibold mt-4">
          {spot.description || 'スポット記事'}
        </Text>
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-center mt-2">
          スポット記事ページは準備中です
        </Text>
      </View>
    </SafeAreaView>
  );
}
