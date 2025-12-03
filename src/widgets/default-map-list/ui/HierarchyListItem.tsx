/**
 * 階層リストアイテムコンポーネント
 *
 * 階層ナビゲーションで使用するリストアイテム
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MachiRow } from '@/shared/types/database.types';

// 階層レベルの型定義
export type HierarchyLevel = 'home' | 'region' | 'prefecture' | 'city' | 'machi';

// 階層アイテムの型定義
export interface HierarchyItem {
  id: string;
  name: string;
  count?: number; // 配下のアイテム数
  machi?: MachiRow; // 街データ（街レベルの時のみ）
}

interface HierarchyListItemProps {
  item: HierarchyItem;
  level: HierarchyLevel;
  onPress: (item: HierarchyItem) => void;
}

export function HierarchyListItem({ item, level, onPress }: HierarchyListItemProps) {
  // 階層レベルに応じたアイコンを選択
  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    if (level === 'city') {
      // 街レベル - 商店街・街を表すアイコン
      return 'storefront';
    }
    // その他の階層 - 進むアイコン
    return 'chevron-forward';
  };

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="px-5 py-4 border-b border-border-light dark:border-dark-border-light bg-surface dark:bg-dark-surface active:bg-background-secondary dark:bg-dark-background-secondary"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons
            name={getIcon()}
            size={20}
            color="#6B7280"
            style={{ marginRight: 12 }}
          />
          <Text className="text-base text-foreground dark:text-dark-foreground font-medium">{item.name}</Text>
        </View>
        {item.count !== undefined && (
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary ml-2">{item.count}件</Text>
        )}
      </View>
    </Pressable>
  );
}
