/**
 * CollectionDetailSkeleton - コレクション詳細ページのスケルトン
 *
 * CollectionDetailPageのヘッダー + グリッドのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { Skeleton } from './skeleton';

const screenWidth = Dimensions.get('window').width;
const thumbnailWidth = Math.round(screenWidth * 0.35);
const thumbnailHeight = Math.round(thumbnailWidth * (5 / 4));
const gridCardWidth = Math.floor((screenWidth - 44) / 2);
const gridCardImageHeight = Math.round(gridCardWidth * (9 / 16));

function GridCardSkeleton() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 6, paddingBottom: 16 }}>
      <Skeleton className="rounded-lg" style={{ width: gridCardWidth, height: gridCardImageHeight }} />
      <Skeleton className="w-3/4 h-3.5 mt-2" />
      <View className="flex-row items-center mt-1.5">
        <Skeleton className="w-4 h-4 rounded-full mr-1" />
        <Skeleton className="w-16 h-3" />
      </View>
    </View>
  );
}

export function CollectionDetailSkeleton() {
  return (
    <View className="flex-1 bg-surface">
      {/* ヘッダー */}
      <View className="mb-3">
        {/* 背景 */}
        <View
          className="absolute top-0 left-0 right-0 bg-surface-variant"
          style={{ height: 64 + thumbnailHeight * 0.75 }}
        />

        <View className="items-center pt-16 pb-6 px-4">
          {/* サムネイル */}
          <Skeleton style={{ width: thumbnailWidth, height: thumbnailHeight }} />

          {/* タイトル */}
          <Skeleton className="w-40 h-6 mt-8" />

          {/* 説明 */}
          <Skeleton className="w-64 h-3.5 mt-3" />

          {/* 作成者 */}
          <View className="flex-row items-center mt-4">
            <Skeleton className="w-8 h-8 rounded-full mr-2" />
            <Skeleton className="w-20 h-3.5" />
          </View>

          {/* いいねボタン */}
          <Skeleton className="w-12 h-6 rounded mt-4" />
        </View>
      </View>

      {/* グリッド（2列 × 2行） */}
      <View style={{ paddingHorizontal: 10 }}>
        <View className="flex-row">
          <GridCardSkeleton />
          <GridCardSkeleton />
        </View>
        <View className="flex-row">
          <GridCardSkeleton />
          <GridCardSkeleton />
        </View>
      </View>
    </View>
  );
}
