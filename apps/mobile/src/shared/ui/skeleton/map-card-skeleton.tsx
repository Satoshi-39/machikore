/**
 * MapCardSkeleton - フィード用マップカードのスケルトン
 *
 * MapCardのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { getThumbnailHeight } from '@/shared/config';
import { Skeleton } from './skeleton';

const screenWidth = Dimensions.get('window').width;
const thumbnailWidth = screenWidth - 32;
const thumbnailHeight = getThumbnailHeight(thumbnailWidth);

export function MapCardSkeleton() {
  return (
    <View className="bg-surface p-4 border-b-thin border-outline">
      {/* ヘッダー: アバター + ユーザー名 + 日付 */}
      <View className="flex-row items-center mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <View className="ml-3">
          <Skeleton className="w-24 h-3.5 mb-1" />
          <Skeleton className="w-16 h-3" />
        </View>
      </View>

      {/* サムネイル */}
      <Skeleton
        className="w-full rounded-lg mb-3"
        style={{ height: thumbnailHeight }}
      />

      {/* マップ名 + スポット数 */}
      <View className="flex-row items-center mb-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="w-40 h-4 ml-2" />
      </View>

      {/* 説明 2行 */}
      <Skeleton className="w-full h-3.5 mb-1" />
      <Skeleton className="w-3/4 h-3.5 mb-2" />

      {/* タグ */}
      <View className="flex-row mb-2 gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-14 h-6 rounded-full" />
      </View>

      {/* フッター: コメント / いいね / ブックマーク / 共有 */}
      <View className="flex-row items-center justify-around mt-2">
        <Skeleton className="w-10 h-5 rounded" />
        <Skeleton className="w-10 h-5 rounded" />
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="w-5 h-5 rounded" />
      </View>
    </View>
  );
}
