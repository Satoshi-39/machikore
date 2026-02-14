/**
 * CommentItemSkeleton - コメントアイテムのスケルトン
 *
 * CommentItemのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

export function CommentItemSkeleton() {
  return (
    <View className="p-4">
      {/* ヘッダー行: アバター + ユーザー名 + 日時 */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-20 h-3.5 ml-3" />
        </View>
        <Skeleton className="w-12 h-3" />
      </View>

      {/* コメント内容（アバター幅分インデント: 52px） */}
      <View className="ml-[52px] mt-1">
        <Skeleton className="w-full h-3.5 mb-1" />
        <Skeleton className="w-3/5 h-3.5" />

        {/* アクションボタン */}
        <View className="flex-row items-center mt-2 gap-4">
          <Skeleton className="w-8 h-3.5 rounded" />
          <Skeleton className="w-10 h-3.5 rounded" />
        </View>
      </View>
    </View>
  );
}
