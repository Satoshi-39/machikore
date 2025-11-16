/**
 * 投稿フィルターヘッダー
 *
 * ソート順とフィルターモードを切り替えるUI
 */

import {
  usePostStore,
  type PostFilterMode,
  type PostSortOrder,
} from '@/entities/post/model';
import { colors } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function PostFilterHeader() {
  const { sortOrder, filterMode, setSortOrder, setFilterMode } = usePostStore();
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filterTabs: { mode: PostFilterMode; label: string }[] = [
    { mode: 'all', label: 'スポット' },
    { mode: 'my-posts', label: 'マップ' },
  ];

  const sortOptions: { order: PostSortOrder; label: string; icon: string }[] = [
    { order: 'latest', label: '新しい順', icon: 'arrow-down' },
    { order: 'oldest', label: '古い順', icon: 'arrow-up' },
    { order: 'popular', label: '人気順', icon: 'heart' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.order === sortOrder)?.label || '新しい順';

  return (
    <View className="bg-white border-b border-gray-200">
      {/* フィルタータブ */}
      <View className="flex-row">
        {filterTabs.map((tab) => (
          <Pressable
            key={tab.mode}
            onPress={() => setFilterMode(tab.mode)}
            className="flex-1 py-4 items-center"
          >
            <Text
              className={`text-sm font-semibold ${
                filterMode === tab.mode ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
            {filterMode === tab.mode && (
              <View
                className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* ソートボタン */}
      <View className="px-4 py-2 flex-row justify-end">
        <Pressable
          onPress={() => setShowSortMenu(!showSortMenu)}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100"
        >
          <Ionicons
            name="swap-vertical"
            size={16}
            color={colors.text.secondary}
          />
          <Text className="text-xs text-gray-600">{currentSortLabel}</Text>
        </Pressable>

        {/* ソートメニュー */}
        {showSortMenu && (
          <View className="absolute top-10 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            {sortOptions.map((option) => (
              <Pressable
                key={option.order}
                onPress={() => {
                  setSortOrder(option.order);
                  setShowSortMenu(false);
                }}
                className={`flex-row items-center gap-2 px-4 py-3 ${
                  sortOrder === option.order ? 'bg-blue-50' : ''
                }`}
              >
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={
                    sortOrder === option.order
                      ? colors.primary.DEFAULT
                      : colors.text.secondary
                  }
                />
                <Text
                  className={`text-sm ${
                    sortOrder === option.order
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
