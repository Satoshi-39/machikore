/**
 * UserListItemSkeleton - ユーザーリストアイテムのスケルトン
 *
 * UserListItemのレイアウトに合わせたプレースホルダー
 * アバター(48×48) + テキスト
 */

import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

export function UserListItemSkeleton() {
  return (
    <View className="bg-surface border-b-hairline border-outline-variant p-4 flex-row items-center">
      {/* アバター */}
      <Skeleton className="w-12 h-12 rounded-full mr-3" />

      {/* ユーザー情報 */}
      <View className="flex-1">
        {/* 表示名 */}
        <Skeleton className="w-28 h-4 mb-1" />
        {/* @ユーザー名 */}
        <Skeleton className="w-20 h-3.5" />
        {/* bio */}
        <Skeleton className="w-48 h-3.5 mt-1" />
      </View>
    </View>
  );
}
