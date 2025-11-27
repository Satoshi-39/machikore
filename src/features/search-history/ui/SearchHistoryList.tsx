/**
 * 検索履歴リストUI
 */

import { colors } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { SearchHistoryItem } from '../api/search-history-storage';

const INITIAL_DISPLAY_COUNT = 8; // 初期表示件数
const MAX_DISPLAY_COUNT = 20; // 最大表示件数

interface SearchHistoryListProps {
  history: SearchHistoryItem[];
  onSelect: (query: string) => void;
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  title?: string;
  showEmptyMessage?: boolean;
  emptyMessage?: string;
}

export function SearchHistoryList({
  history,
  onSelect,
  onRemove,
  onClearAll,
  title = '検索履歴',
  showEmptyMessage = true,
  emptyMessage = '検索履歴がありません',
}: SearchHistoryListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) {
    if (!showEmptyMessage) {
      return null;
    }
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="time-outline" size={80} color="#D1D5DB" />
        <Text className="text-lg font-medium text-gray-500 mt-6">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  // 表示する履歴を制限
  const displayCount = isExpanded ? MAX_DISPLAY_COUNT : INITIAL_DISPLAY_COUNT;
  const displayHistory = history.slice(0, displayCount);
  const hasMore = history.length > INITIAL_DISPLAY_COUNT && !isExpanded;

  return (
    <View>
      {/* ヘッダー */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-gray-500">{title}</Text>
        {onClearAll && history.length > 0 && (
          <Pressable onPress={onClearAll} hitSlop={8}>
            <Text className="text-sm text-blue-600">すべて削除</Text>
          </Pressable>
        )}
      </View>

      {/* 履歴リスト */}
      {displayHistory.map((item) => (
        <View
          key={item.id}
          className="flex-row items-center py-3 border-b border-gray-100"
        >
          <Pressable
            onPress={() => onSelect(item.query)}
            className="flex-1 flex-row items-center active:opacity-70"
          >
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons
                name="time-outline"
                size={18}
                color={colors.gray[500]}
              />
            </View>
            <Text
              className="flex-1 ml-3 text-base text-gray-800"
              numberOfLines={1}
            >
              {item.query}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onRemove(item.id)}
            hitSlop={8}
            className="p-2"
          >
            <Ionicons name="close" size={18} color={colors.gray[400]} />
          </Pressable>
        </View>
      ))}

      {/* もっと見るボタン */}
      {hasMore && (
        <Pressable
          onPress={() => setIsExpanded(true)}
          className="py-3 items-center"
        >
          <Text className="text-sm text-blue-600">履歴をもっと見る</Text>
        </Pressable>
      )}
    </View>
  );
}
