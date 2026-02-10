/**
 * FeaturedCarouselSkeleton - 特集カルーセルのスケルトン
 *
 * FeaturedItemsカルーセルのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { FEATURED_CAROUSEL } from '@/shared/config';
import { Skeleton } from './skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * FEATURED_CAROUSEL.CARD_WIDTH_RATIO;
const CARD_HEIGHT = FEATURED_CAROUSEL.CARD_HEIGHT;

export function FeaturedCarouselSkeleton() {
  return (
    <View className="py-4 items-center">
      {/* メインカード */}
      <Skeleton
        className="rounded-2xl"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      />

      {/* ページインジケータードット */}
      <View className="flex-row items-center justify-center mt-3 gap-1.5">
        <Skeleton className="w-1.5 h-1.5 rounded-full" />
        <Skeleton className="w-1.5 h-1.5 rounded-full" />
        <Skeleton className="w-1.5 h-1.5 rounded-full" />
      </View>
    </View>
  );
}
