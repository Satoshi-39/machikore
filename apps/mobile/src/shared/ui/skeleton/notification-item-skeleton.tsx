/**
 * NotificationItemSkeleton - 通知アイテムのスケルトン
 *
 * NotificationItemのレイアウトに合わせたプレースホルダー
 * アバター(48×48) + バッジ(24×24) + テキスト
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

export function NotificationItemSkeleton() {
  return (
    <View className="flex-row p-4 border-b-hairline border-outline-variant bg-surface">
      {/* アバター + バッジ */}
      <View className="mr-3">
        <View className="relative">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton
            className="w-6 h-6 rounded-full absolute -bottom-1 -right-1"
          />
        </View>
      </View>

      {/* コンテンツ */}
      <View className="flex-1">
        {/* メッセージ 2行 */}
        <Skeleton className="w-full h-3.5 mb-1" />
        <Skeleton className="w-3/4 h-3.5 mb-1" />
        {/* コメント内容 */}
        <Skeleton className="w-1/2 h-3.5 mt-1" />
        {/* 時間 */}
        <Skeleton className="w-16 h-3 mt-1" />
      </View>
    </View>
  );
}
