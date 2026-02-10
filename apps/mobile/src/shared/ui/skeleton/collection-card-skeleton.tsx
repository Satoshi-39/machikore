/**
 * CollectionCardSkeleton - コレクションカードのスケルトン
 *
 * CollectionCardのレイアウトに合わせたプレースホルダー
 * サムネイル(64×80) + 右側情報
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

export function CollectionCardSkeleton() {
  return (
    <View className="bg-surface">
      <View className="px-4 py-4">
        <View className="flex-row items-start">
          {/* サムネイル */}
          <Skeleton
            className="mr-3"
            style={{ width: 64, height: 80 }}
          />

          {/* コレクション情報 */}
          <View className="flex-1">
            {/* 名前 */}
            <Skeleton className="w-32 h-4 mb-1" />
            {/* 説明 2行 */}
            <Skeleton className="w-full h-3.5 mb-1" />
            <Skeleton className="w-3/4 h-3.5 mb-2" />
            {/* マップ数 + 日付 */}
            <View className="flex-row items-center gap-3">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-20 h-3" />
            </View>
          </View>
        </View>
      </View>
      {/* 下部ボーダー */}
      <View className="mx-4 border-b-hairline border-outline-variant" />
    </View>
  );
}
