/**
 * カテゴリ選択ステップ
 *
 * オンボーディングの一部として表示（任意、スキップ可能）
 * - 好みのカテゴリを1〜3つまで選択
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import {
  getOnboardingSteps,
  ONBOARDING_STEP_KEYS,
  USER_PREFERENCES,
  colors,
} from '@/shared/config';
import { getCategories, getCategoryName, type Category } from '@/shared/api/supabase/categories';
import { updatePreferredCategories } from '@/shared/api/supabase/user-preferences';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import { OnboardingProgress, Button } from '@/shared/ui';

interface CategoryPreferenceStepProps {
  onComplete: () => void;
}

const MAX_CATEGORIES = USER_PREFERENCES.MAX_PREFERRED_CATEGORIES;

export function CategoryPreferenceStep({ onComplete }: CategoryPreferenceStepProps) {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();

  // オンボーディングステップ定義
  const onboardingSteps = getOnboardingSteps(t);
  const currentStepIndex = Object.values(ONBOARDING_STEP_KEYS).indexOf(
    ONBOARDING_STEP_KEYS.CATEGORIES
  );

  // 状態
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // カテゴリを取得
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        log.error('[CategoryPreferenceStep] カテゴリ取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // カテゴリ選択/解除
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // 選択解除
        return prev.filter((id) => id !== categoryId);
      } else if (prev.length < MAX_CATEGORIES) {
        // 選択（最大3つまで）
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  // 保存
  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      // 選択なしでも続行可能
      onComplete();
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePreferredCategories(selectedCategories);
    } catch (err) {
      log.error('[CategoryPreferenceStep] 保存に失敗:', err);
      // エラーでも続行（任意項目のため）
    } finally {
      setIsSubmitting(false);
      onComplete();
    }
  };

  // スキップ
  const handleSkip = () => {
    onComplete();
  };

  // カテゴリアイコンのマッピング
  const getCategoryIcon = (categoryId: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      food: 'restaurant',
      travel: 'airplane',
      sightseeing: 'camera',
      shopping: 'cart',
      activity: 'bicycle',
      other: 'ellipsis-horizontal',
    };
    return iconMap[categoryId] || 'folder';
  };

  return (
    <View
      className="flex-1 bg-surface dark:bg-dark-surface"
      style={{ paddingTop: insets.top }}
    >
      {/* ヘッダー */}
      <View className="flex-row items-center justify-center px-4 py-3 border-b border-border-light dark:border-dark-border-light">
        <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
          {t('onboarding.categories.title')}
        </Text>
        <Pressable onPress={handleSkip} className="absolute right-4">
          <Text className="text-base text-foreground dark:text-dark-foreground">{t('common.skip')}</Text>
        </Pressable>
      </View>

      {/* 進捗インジケーター */}
      <OnboardingProgress steps={onboardingSteps} currentStep={currentStepIndex} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* 説明 */}
        <View className="py-4">
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center leading-6">
            {t('onboarding.categories.description')}
          </Text>
          <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary text-center mt-2">
            {t('onboarding.categories.maxSelection', { max: MAX_CATEGORIES })}
          </Text>
        </View>

        {/* カテゴリ一覧 */}
        {isLoading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-center gap-3 pb-8">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              const isDisabled = !isSelected && selectedCategories.length >= MAX_CATEGORIES;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => toggleCategory(category.id)}
                  disabled={isDisabled}
                  className={`
                    px-4 py-3 rounded-xl border-2 min-w-[100px] items-center
                    ${isSelected
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-border-light dark:border-dark-border-light bg-muted dark:bg-dark-muted'
                    }
                    ${isDisabled ? 'opacity-40' : ''}
                  `}
                >
                  <Ionicons
                    name={getCategoryIcon(category.id)}
                    size={28}
                    color={isSelected ? colors.primary.DEFAULT : '#9CA3AF'}
                  />
                  <Text
                    className={`mt-2 text-sm font-medium ${
                      isSelected
                        ? 'text-primary'
                        : 'text-foreground dark:text-dark-foreground'
                    }`}
                  >
                    {getCategoryName(category, locale)}
                  </Text>
                  {isSelected && (
                    <View className="absolute top-1 right-1">
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary.DEFAULT} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* ナビゲーションボタン */}
      <View
        className="px-4 pb-4 bg-surface dark:bg-dark-surface"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Button
          title={t('common.next')}
          onPress={handleSave}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
}
