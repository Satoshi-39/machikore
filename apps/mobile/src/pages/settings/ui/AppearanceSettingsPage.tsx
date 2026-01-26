/**
 * 外観設定ページ
 *
 * テーマ設定（ライト/ダーク/システム）を管理
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { iconSizeNum } from '@/shared/config';
import { PageHeader } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useThemePreference, type ThemePreference } from '@/entities/user/api';

// テーマ選択肢の型
interface ThemeOption {
  value: ThemePreference;
  labelKey: 'lightMode' | 'darkMode' | 'systemDefault';
  icon: keyof typeof Ionicons.glyphMap;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'system', labelKey: 'systemDefault', icon: 'phone-portrait-outline' },
  { value: 'light', labelKey: 'lightMode', icon: 'sunny-outline' },
  { value: 'dark', labelKey: 'darkMode', icon: 'moon-outline' },
];

// セクションヘッダー
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-xs font-medium text-on-surface-variant uppercase px-4 pt-6 pb-2">
      {title}
    </Text>
  );
}

// テーマ選択アイテム
interface ThemeItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
  isLast?: boolean;
}

function ThemeItem({ label, icon, isSelected, onPress, isLast }: ThemeItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-3.5 active:bg-secondary ${
        !isLast ? 'border-b border-outline-variant' : ''
      }`}
    >
      <Ionicons
        name={icon}
        size={iconSizeNum.lg}
        className="text-on-surface-variant"
        style={{ marginRight: 12 }}
      />
      <Text className="flex-1 text-base text-on-surface">
        {label}
      </Text>
      {isSelected && (
        <Ionicons
          name="checkmark"
          size={iconSizeNum.lg}
          className="text-primary"
        />
      )}
    </Pressable>
  );
}

export function AppearanceSettingsPage() {
  const { t } = useI18n();
  const { theme, setTheme } = useThemePreference();

  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
  };

  // ラベル取得
  const getLabel = (labelKey: ThemeOption['labelKey']): string => {
    return t(`settings.${labelKey}`);
  };


  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.appearance')} showBackButton />

      <ScrollView className="flex-1">
        {/* テーマセクション */}
        <SectionHeader title={t('settings.theme')} />
        <View className="bg-surface">
          {THEME_OPTIONS.map((option, index) => (
            <ThemeItem
              key={option.value}
              label={getLabel(option.labelKey)}
              icon={option.icon}
              isSelected={theme === option.value}
              onPress={() => handleThemeChange(option.value)}
              isLast={index === THEME_OPTIONS.length - 1}
            />
          ))}
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
