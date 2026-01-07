/**
 * 興味・関心セクション
 *
 * カテゴリ選択UI
 */

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { colors, USER_PREFERENCES } from '@/shared/config';
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

  return (
    <View className="bg-surface dark:bg-dark-surface mt-2 px-4 py-4 border-t border-border-light dark:border-dark-border">
      <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
        {t('profile.interests')}
      </Text>
      <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted mb-4">
        {t('profile.interestsDescription', { max: MAX_CATEGORIES })}
      </Text>

      {isLoading ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
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
                  px-4 py-2 rounded-full border
                  ${isSelected
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-border-light dark:border-dark-border-light bg-muted dark:bg-dark-muted'
                  }
                  ${isDisabled ? 'opacity-40' : ''}
                `}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? 'text-primary font-medium'
                      : 'text-foreground dark:text-dark-foreground'
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
