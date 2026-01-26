/**
 * 記事目次コンポーネント
 *
 * スポット一覧を目次形式で表示し、タップでスクロール
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PrivateBadge } from '@/shared/ui';
import type { SpotWithImages } from '@/shared/types';
import { useI18n } from '@/shared/lib/i18n';
import { extractName } from '@/shared/lib/utils/multilang.utils';

interface ArticleTableOfContentsProps {
  spots: SpotWithImages[];
  /** オーナーかどうか（非公開スポットの鍵マーク表示に使用） */
  isOwner?: boolean;
  onSpotPress: (spotId: string) => void;
}

export function ArticleTableOfContents({ spots, isOwner, onSpotPress }: ArticleTableOfContentsProps) {
  const { t, locale } = useI18n();

  if (spots.length === 0) return null;

  return (
    <View className="mb-6 py-4 px-4 bg-surface rounded-lg border border-outline">
      <Text className="text-base font-semibold text-on-surface mb-3">
        {t('article.tableOfContents')}
      </Text>
      {spots.map((spot, index) => {
        // スポット名（JSONB型を現在のlocaleで抽出）
        // master_spotがある場合はその名前、ない場合（ピン刺し・現在地登録）はspot.nameを使用
        const spotName = spot.master_spot?.name
          ? extractName(spot.master_spot.name, locale) || t('article.unknownSpot')
          : (spot.name ? extractName(spot.name, locale) : null) || t('article.unknownSpot');
        return (
          <Pressable
            key={spot.id}
            onPress={() => onSpotPress(spot.id)}
            className="flex-row items-center py-2"
          >
            <Text className="text-sm text-on-surface font-medium mr-2">
              {index + 1}.
            </Text>
            <View className="flex-row items-center flex-1">
              {/* オーナーの場合、非公開スポットに鍵マークを表示（スポット名の前） */}
              {isOwner && spot.is_public === false && (
                <PrivateBadge size="sm" className="mr-1" />
              )}
              <Text className="text-sm text-on-surface-variant flex-shrink" numberOfLines={1}>
                {spotName}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
