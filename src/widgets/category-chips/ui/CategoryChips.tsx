/**
 * カテゴリタブWidget
 *
 * 横スクロールのカテゴリ選択タブを表示
 * 選択時は下線でフォーカス表示
 */

import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { colors } from '@/shared/config';

// カテゴリ定義
export const CATEGORIES = [
  { id: 'all', label: 'すべて', tag: null },
  { id: 'gourmet', label: 'グルメ', tag: 'グルメ' },
  { id: 'cafe', label: 'カフェ', tag: 'カフェ' },
  { id: 'ramen', label: 'ラーメン', tag: 'ラーメン' },
  { id: 'izakaya', label: '居酒屋', tag: '居酒屋' },
  { id: 'sweets', label: 'スイーツ', tag: 'スイーツ' },
  { id: 'shopping', label: 'ショッピング', tag: 'ショッピング' },
  { id: 'tourism', label: '観光', tag: '観光' },
  { id: 'nature', label: '自然', tag: '自然' },
  { id: 'nightview', label: '夜景', tag: '夜景' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

interface CategoryChipsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 20 }}
      className="py-2"
    >
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className="items-center py-2 active:opacity-70"
          >
            <Text
              className={`text-sm font-medium ${
                isSelected
                  ? 'text-primary'
                  : 'text-foreground-muted dark:text-dark-foreground-muted'
              }`}
            >
              {category.label}
            </Text>
            {isSelected && (
              <View
                style={{
                  height: 2,
                  backgroundColor: colors.primary.DEFAULT,
                  marginTop: 6,
                  borderRadius: 1,
                  alignSelf: 'stretch',
                }}
              />
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
