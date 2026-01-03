/**
 * 記事目次コンポーネント
 *
 * スポット一覧を目次形式で表示し、タップでスクロール
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { SpotWithImages } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';

interface ArticleTableOfContentsProps {
  spots: SpotWithImages[];
  onSpotPress: (spotId: string) => void;
}

export function ArticleTableOfContents({ spots, onSpotPress }: ArticleTableOfContentsProps) {
  const { t } = useI18n();

  if (spots.length === 0) return null;

  return (
    <View className="mb-6 py-4 px-4 bg-surface dark:bg-dark-surface rounded-lg border border-border dark:border-dark-border">
      <Text className="text-base font-semibold text-foreground dark:text-dark-foreground mb-3">
        {t('article.tableOfContents')}
      </Text>
      {spots.map((spot, index) => {
        const spotName = spot.master_spot?.name || spot.description || t('article.unknownSpot');
        return (
          <Pressable
            key={spot.id}
            onPress={() => onSpotPress(spot.id)}
            className="flex-row items-center py-2"
          >
            <Text className="text-sm text-foreground dark:text-dark-foreground font-medium mr-2">
              {index + 1}.
            </Text>
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary flex-1" numberOfLines={1}>
              {spotName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
