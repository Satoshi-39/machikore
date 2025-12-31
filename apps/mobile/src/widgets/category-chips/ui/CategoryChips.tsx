/**
 * カテゴリタブWidget
 *
 * 横スクロールのカテゴリ選択タブを表示
 * 選択時は下線でフォーカス表示
 * カテゴリはcategoriesテーブルから取得
 */

import React, { useMemo } from 'react';
import { ScrollView, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n, getTranslatedName } from '@/shared/lib/i18n';
import { useCategories } from '@/entities/category';

// 「すべて」カテゴリのID
const ALL_CATEGORY_ID = 'all';

export type CategoryId = string;

interface CategoryChipsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
}

export function CategoryChips({ selectedCategory, onSelectCategory }: CategoryChipsProps) {
  const isDarkMode = useIsDarkMode();
  const selectedColor = isDarkMode ? colors.dark.foreground : colors.light.foreground;
  const { data: categories = [], isLoading } = useCategories();
  const { t } = useI18n();

  // 「すべて」を先頭に追加したカテゴリリスト
  const displayCategories = useMemo(() => {
    const allCategory = { id: ALL_CATEGORY_ID, name: t('common.all'), slug: 'all', icon: '', display_order: 0, is_active: true, name_translations: null, created_at: '', updated_at: '' };
    return [allCategory, ...categories];
  }, [categories, t]);

  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 20 }}
      className="py-2"
    >
      {displayCategories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className="items-center py-2 active:opacity-70"
          >
            <Text
              style={isSelected ? { color: selectedColor } : undefined}
              className={`text-sm font-medium ${
                isSelected
                  ? ''
                  : 'text-foreground-muted dark:text-dark-foreground-muted'
              }`}
            >
              {getTranslatedName(category.name, category.name_translations)}
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
