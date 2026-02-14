/**
 * SpotArticleSkeleton - スポット記事ページのスケルトン
 *
 * SpotArticleContentのレイアウトに合わせたプレースホルダー
 */

import React from 'react';
import { View, Dimensions } from 'react-native';
import { getThumbnailHeight } from '@/shared/config';
import { Skeleton } from './skeleton';

const screenWidth = Dimensions.get('window').width;
const contentPadding = 32;
const imageWidth = screenWidth - contentPadding;
const imageHeight = getThumbnailHeight(imageWidth);

export function SpotArticleSkeleton() {
  return (
    <View className="flex-1 bg-surface">
      {/* スポット名 + いいねボタン */}
      <View className="px-4 pt-4 pb-3">
        <View className="flex-row items-start mb-2">
          <Skeleton className="flex-1 h-7" />
          <Skeleton className="w-10 h-6 ml-2 rounded" />
        </View>

        {/* 住所 */}
        <View className="flex-row items-center">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="w-48 h-3.5 ml-1" />
        </View>
      </View>

      {/* サムネイル画像 */}
      <View className="px-4">
        <Skeleton className="w-full" style={{ height: imageHeight }} />
      </View>

      {/* ひとこと */}
      <View className="px-4 pt-3 mb-5">
        <Skeleton className="w-4/5 h-5" />
      </View>

      {/* 著者情報セクション */}
      <View className="px-4 pb-8">
        <View className="flex-row items-center">
          <Skeleton className="w-8 h-8 rounded-full mr-2" />
          <View>
            <Skeleton className="w-20 h-3 mb-1" />
            <Skeleton className="w-14 h-2.5" />
          </View>
          <View className="flex-1" />
          <Skeleton className="w-24 h-8 rounded-full" />
        </View>
      </View>

      {/* 記事本文プレースホルダー */}
      <View className="px-4 py-2">
        <Skeleton className="w-full h-4 mb-3" />
        <Skeleton className="w-full h-4 mb-3" />
        <Skeleton className="w-5/6 h-4 mb-3" />
        <Skeleton className="w-full h-4 mb-3" />
        <Skeleton className="w-3/4 h-4 mb-6" />

        {/* タグ */}
        <View className="flex-row flex-wrap mb-4 gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-14 h-6 rounded-full" />
        </View>

        {/* アクションバー */}
        <View className="flex-row items-center gap-5 py-4">
          <Skeleton className="w-10 h-5 rounded" />
          <Skeleton className="w-10 h-5 rounded" />
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="w-5 h-5 rounded" />
        </View>
      </View>
    </View>
  );
}
