/**
 * 言語設定ページ
 *
 * useLocalePreferenceを使用してサーバー/ローカルに設定を保存
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useI18n, SUPPORTED_LOCALES, LOCALE_NAMES, type SupportedLocale } from '@/shared/lib/i18n';
import { useLocalePreference, type LocalePreference } from '@/entities/user/api';

interface LanguageItemProps {
  locale: SupportedLocale | 'system';
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

function LanguageItem({ label, isSelected, onPress, icon }: LanguageItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-4 border-b border-border-light dark:border-dark-border-light active:bg-muted dark:active:bg-dark-muted"
    >
      {icon && (
        <Ionicons name={icon} size={22} color={colors.text.secondary} className="mr-3" />
      )}
      <Text className={`flex-1 text-base text-foreground dark:text-dark-foreground ${icon ? 'ml-3' : ''}`}>
        {label}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={24} color={colors.primary.DEFAULT} />
      )}
    </Pressable>
  );
}

export function LanguageSettingsPage() {
  const { t, locale: effectiveLocale } = useI18n();
  const { locale, setLocale } = useLocalePreference();

  const handleLanguageChange = (newLocale: LocalePreference) => {
    setLocale(newLocale);
  };

  // "デバイスの設定に従う"のラベル
  const systemLabel =
    effectiveLocale === 'ja'
      ? 'デバイスの設定に従う'
      : effectiveLocale === 'en'
      ? 'Use device settings'
      : effectiveLocale === 'cn'
      ? '跟随系统设置'
      : '跟隨系統設定';

  // 説明文
  const description =
    effectiveLocale === 'ja'
      ? 'アプリの表示言語を変更します。一部のコンテンツは日本語のまま表示される場合があります。'
      : effectiveLocale === 'en'
      ? 'Change the app display language. Some content may still be displayed in Japanese.'
      : effectiveLocale === 'cn'
      ? '更改应用显示语言。部分内容可能仍以日语显示。'
      : '變更應用程式顯示語言。部分內容可能仍以日語顯示。';

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={t('settings.language')} showBackButton />

      <View className="bg-surface dark:bg-dark-surface">
        {/* デバイスの設定に従うオプション */}
        <LanguageItem
          locale="system"
          label={systemLabel}
          isSelected={locale === 'system'}
          onPress={() => handleLanguageChange('system')}
          icon="phone-portrait-outline"
        />

        {/* 区切り */}
        <View className="h-6 bg-background dark:bg-dark-background" />

        {/* 言語一覧 */}
        {SUPPORTED_LOCALES.map((loc) => (
          <LanguageItem
            key={loc}
            locale={loc}
            label={LOCALE_NAMES[loc]}
            isSelected={locale === loc}
            onPress={() => handleLanguageChange(loc)}
          />
        ))}
      </View>

      {/* 説明文 */}
      <View className="px-4 pt-3">
        <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
          {description}
        </Text>
      </View>
    </View>
  );
}
