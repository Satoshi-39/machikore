/**
 * MapListCardSkeleton - リスト用マップカードのスケルトン
 *
 * MapListCardのレイアウトに合わせたプレースホルダー
 * サムネイル(128x67) + 右側情報
 */

import React from 'react';
import { View } from 'react-native';
import { getThumbnailHeight } from '@/shared/config';
import { Skeleton } from './skeleton';

const THUMBNAIL_WIDTH = 128;
const THUMBNAIL_HEIGHT = getThumbnailHeight(THUMBNAIL_WIDTH);

export function MapListCardSkeleton() {
  return (
    <View className="bg-surface">
      <View className="px-4 py-3">
        <View className="flex-row items-start">
          {/* 左: サムネイル */}
          <Skeleton
            className="rounded-lg"
            style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
          />

          {/* 右: マップ情報 */}
          <View className="flex-1 ml-3 justify-between" style={{ height: THUMBNAIL_HEIGHT }}>
            {/* マップ名 + スポット数 */}
            <View>
              <Skeleton className="w-32 h-3.5 mb-2" />
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
      {/* 下部ボーダー */}
      <View className="mx-4 border-b-hairline border-outline-variant" />
    </View>
  );
}
