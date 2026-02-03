/**
 * 興味・関心セクション
 *
 * カテゴリ選択UI
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { USER_PREFERENCES, colors, borderWidthNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { getCategoryName, type Category } from '@/shared/api/supabase/categories';
import { useI18n } from '@/shared/lib/i18n';

const MAX_CATEGORIES = USER_PREFERENCES.MAX_PREFERRED_CATEGORIES;

interface InterestsSectionProps {
  /** カテゴリ一覧 */
  categories: Category[];
  /** 選択されたカテゴリID */
  selectedCategories: string[];
  /** カテゴリ選択/解除時のコールバック */
  onToggleCategory: (categoryId: string) => void;
  /** ローディング中かどうか */
  isLoading: boolean;
}

export function InterestsSection({
  categories,
  selectedCategories,
  onToggleCategory,
  isLoading,
}: InterestsSectionProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View className="bg-surface px-4 py-4 border-t-hairline border-outline-variant">
      <Text className="text-sm font-medium text-on-surface-variant mb-2">
        {t('profile.interests')}
      </Text>
      <Text className="text-xs text-on-surface-variant mb-4">
        {t('profile.interestsDescription', { max: MAX_CATEGORIES })}
      </Text>

      {isLoading ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" className="text-primary" />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const isDisabled = !isSelected && selectedCategories.length >= MAX_CATEGORIES;

            return (
              <Pressable
                key={category.id}
                onPress={() => onToggleCategory(category.id)}
                disabled={isDisabled}
                className={`
                  px-4 py-2 rounded-full
                  ${isSelected
                    ? 'bg-primary-container'
                    : 'border border-outline-variant bg-secondary'
                  }
                  ${isDisabled ? 'opacity-40' : ''}
                `}
                style={isSelected ? { borderWidth: borderWidthNum.thin, borderColor: themeColors.primary } : undefined}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? 'text-primary font-medium'
                      : 'text-on-surface'
                  }`}
                >
                  {getCategoryName(category, locale)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
