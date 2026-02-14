/**
 * SpotCardSkeleton - フィード用スポットカードのスケルトン
 *
 * SpotCardのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { Skeleton } from './skeleton';

const screenWidth = Dimensions.get('window').width;
const contentWidth = screenWidth - 32;

export function SpotCardSkeleton() {
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

      {/* スポット名 */}
      <Skeleton className="w-36 h-4 mb-1" />

      {/* 住所 */}
      <Skeleton className="w-48 h-3.5 mb-2" />

      {/* 画像グリッド (2x2) */}
      <View
        className="mb-4 rounded-lg overflow-hidden"
        style={{ width: contentWidth, height: contentWidth * 0.6 }}
      >
        <Skeleton className="w-full h-full" />
      </View>

      {/* ひとこと（description） */}
      <Skeleton className="w-3/4 h-5 mb-6" />

      {/* タグ */}
      <View className="flex-row mb-2 gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
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
