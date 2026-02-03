/**
 * 検索履歴リストUI
 */

import { colors, iconSizeNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { SearchHistoryItem } from '@/shared/api/supabase/search-history';

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
  title,
  showEmptyMessage = true,
  emptyMessage,
}: SearchHistoryListProps) {
  const { t } = useI18n();
  const displayTitle = title ?? t('search.recentSearches');
  const displayEmptyMessage = emptyMessage ?? t('search.noSearchHistory');
  const [isExpanded, setIsExpanded] = useState(false);
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const linkColor = themeColors[isDarkMode ? 'on-surface' : 'primary-hover'];

  if (history.length === 0) {
    if (!showEmptyMessage) {
      return null;
    }
    return (
      <View className="flex-1 justify-center items-center py-12">
        <Ionicons name="time-outline" size={80} color={themeColors['outline-variant']} />
        <Text className="text-lg font-medium text-on-surface-variant mt-6">
          {displayEmptyMessage}
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
        <Text className="text-sm font-medium text-on-surface-variant">{displayTitle}</Text>
        {onClearAll && history.length > 0 && (
          <Pressable onPress={onClearAll} hitSlop={8}>
            <Text className="text-sm" style={{ color: linkColor }}>{t('search.clearAll')}</Text>
          </Pressable>
        )}
      </View>

      {/* 履歴リスト */}
      {displayHistory.map((item) => (
        <View
          key={item.id}
          className="flex-row items-center py-3 border-b-hairline border-outline-variant"
        >
          <Pressable
            onPress={() => onSelect(item.query)}
            className="flex-1 flex-row items-center active:opacity-70"
          >
            <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
              <Ionicons
                name="time-outline"
                size={iconSizeNum.md}
                className="text-gray-500"
              />
            </View>
            <Text
              className="flex-1 ml-3 text-base text-on-surface"
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
            <Ionicons name="close" size={iconSizeNum.md} className="text-gray-400" />
          </Pressable>
        </View>
      ))}

      {/* もっと見るボタン */}
      {hasMore && (
        <Pressable
          onPress={() => setIsExpanded(true)}
          className="py-3 items-center"
        >
          <Text className="text-sm" style={{ color: linkColor }}>{t('search.showMore')}</Text>
        </Pressable>
      )}
    </View>
  );
}
