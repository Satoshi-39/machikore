/**
 * MapArticleSkeleton - マップ記事ページのスケルトン
 *
 * MapArticleContentのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { getThumbnailHeight } from '@/shared/config';
import { Skeleton } from './skeleton';

const screenWidth = Dimensions.get('window').width;
const heroHeight = getThumbnailHeight(screenWidth);

export function MapArticleSkeleton() {
  return (
    <View className="flex-1 bg-surface">
      {/* ヒーロー画像 */}
      <Skeleton className="w-full" style={{ height: heroHeight }} />

      <View className="px-4 py-4">
        {/* マップタイトル */}
        <Skeleton className="w-3/4 h-7 mb-3" />

        {/* スポット数 + いいね */}
        <View className="flex-row items-center gap-4 mb-5">
          <Skeleton className="w-20 h-4 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
        </View>

        {/* 作成者情報 */}
        <View className="flex-row items-center mb-4">
          <Skeleton className="w-8 h-8 rounded-full mr-2" />
          <View>
            <Skeleton className="w-20 h-3 mb-1" />
            <Skeleton className="w-14 h-2.5" />
          </View>
          <View className="flex-1" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </View>

        {/* マップ説明 */}
        <View className="mb-6 py-4">
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-2/3 h-4" />
        </View>

        {/* 目次プレースホルダー */}
        <View className="mb-6 p-4 rounded-lg border-thin border-outline">
          <Skeleton className="w-16 h-5 mb-3" />
          <View className="gap-2.5">
            <View className="flex-row items-center">
              <Skeleton className="w-5 h-5 rounded-full mr-2" />
              <Skeleton className="w-40 h-4" />
            </View>
            <View className="flex-row items-center">
              <Skeleton className="w-5 h-5 rounded-full mr-2" />
              <Skeleton className="w-48 h-4" />
            </View>
            <View className="flex-row items-center">
              <Skeleton className="w-5 h-5 rounded-full mr-2" />
              <Skeleton className="w-36 h-4" />
            </View>
          </View>
        </View>

        {/* 記事本文プレースホルダー */}
        <Skeleton className="w-full h-4 mb-3" />
        <Skeleton className="w-full h-4 mb-3" />
        <Skeleton className="w-5/6 h-4 mb-3" />
        <Skeleton className="w-full h-4 mb-3" />
        <Skeleton className="w-3/4 h-4" />
      </View>
    </View>
  );
}
