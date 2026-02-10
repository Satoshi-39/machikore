/**
 * MapDisplayCardSkeleton - 発見タブ横スクロール用マップカードのスケルトン
 *
 * MapDisplayCardのレイアウトに合わせたプレースホルダー
 * size: small(160×h) / medium(250×h)
 */

import React from 'react';
import { View } from 'react-native';
import { getThumbnailHeight } from '@/shared/config';
import { Skeleton } from './skeleton';

interface MapDisplayCardSkeletonProps {
  size?: 'small' | 'medium';
}

const CARD_SIZES = {
  small: { width: 160, avatarClass: 'w-4 h-4', titleClass: 'w-20 h-3', nameClass: 'w-14 h-2.5' },
  medium: { width: 250, avatarClass: 'w-5 h-5', titleClass: 'w-32 h-3.5', nameClass: 'w-20 h-3' },
} as const;

export function MapDisplayCardSkeleton({ size = 'small' }: MapDisplayCardSkeletonProps) {
  const config = CARD_SIZES[size];
  const cardWidth = config.width;
  const cardHeight = getThumbnailHeight(cardWidth);

  return (
    <View className="mr-3" style={{ width: cardWidth }}>
      {/* サムネイル */}
      <Skeleton
        className="rounded-xl"
        style={{ width: cardWidth, height: cardHeight }}
      />

      {/* タイトル */}
      <View className="mt-2">
        <Skeleton className={config.titleClass} />
      </View>

      {/* アバター + ユーザー名 */}
      <View className="flex-row items-center mt-1">
        <Skeleton className={`${config.avatarClass} rounded-full`} />
        <Skeleton className={`${config.nameClass} ml-1`} />
      </View>

      {/* 日付 + アイコン */}
      <View className="flex-row items-center justify-between mt-2 pb-1">
        <Skeleton className="w-12 h-2.5" />
        <View className="flex-row items-center gap-6">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-4 h-4" />
        </View>
      </View>
    </View>
  );
}
