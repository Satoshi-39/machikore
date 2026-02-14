/**
 * BookmarkFolderSkeleton - ブックマークフォルダアイテムのスケルトン
 *
 * BookmarkFolderListの各フォルダアイテムのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

export function BookmarkFolderSkeleton() {
  return (
    <View className="bg-surface">
      <View className="px-4 py-4 flex-row items-center">
        {/* フォルダアイコン */}
        <Skeleton className="w-10 h-10 rounded-lg mr-3" />

        {/* フォルダ情報 */}
        <View className="flex-1">
          <Skeleton className="w-28 h-4 mb-1" />
          <Skeleton className="w-16 h-3.5" />
        </View>
      </View>
      <View className="mx-4 border-b-hairline border-outline-variant" />
    </View>
  );
}
