/**
 * SpotListCardSkeleton - リスト用スポットカードのスケルトン
 *
 * SpotListCardのレイアウトに合わせたプレースホルダー
 * サムネイル(96x96) + 右側情報
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

const THUMBNAIL_SIZE = 96;

export function SpotListCardSkeleton() {
  return (
    <View className="px-4 py-3 bg-surface border-b-hairline border-outline-variant">
      <View className="flex-row items-start">
        {/* 左: サムネイル（正方形） */}
        <Skeleton
          className="rounded-lg"
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
        />

        {/* 右: スポット情報 */}
        <View className="flex-1 ml-3 justify-between" style={{ height: THUMBNAIL_SIZE }}>
          <View>
            {/* スポット名 */}
            <Skeleton className="w-28 h-3.5 mb-1.5" />
            {/* 説明 */}
            <Skeleton className="w-40 h-3 mb-1" />
            {/* 住所 */}
            <Skeleton className="w-36 h-3 mb-1.5" />
            {/* ユーザー */}
            <View className="flex-row items-center">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-20 h-3 ml-1" />
            </View>
          </View>

          {/* 日付 */}
          <Skeleton className="w-16 h-3" />
        </View>
      </View>
    </View>
  );
}
