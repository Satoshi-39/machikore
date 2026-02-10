/**
 * AnnouncementItemSkeleton - お知らせアイテムのスケルトン
 *
 * AnnouncementItemのレイアウトに合わせたプレースホルダー
 * アイコン円(40×40) + テキスト
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

export function AnnouncementItemSkeleton() {
  return (
    <View className="p-4 border-b-hairline border-outline-variant bg-surface">
      <View className="flex-row items-start">
        {/* アイコン */}
        <Skeleton className="w-10 h-10 rounded-full mr-3" />

        {/* コンテンツ */}
        <View className="flex-1">
          {/* タイトル */}
          <Skeleton className="w-40 h-4 mb-1" />
          {/* 内容 2行 */}
          <Skeleton className="w-full h-3.5 mb-1" />
          <Skeleton className="w-3/4 h-3.5" />
          {/* 日付 */}
          <Skeleton className="w-20 h-3 mt-2" />
        </View>
      </View>
    </View>
  );
}
