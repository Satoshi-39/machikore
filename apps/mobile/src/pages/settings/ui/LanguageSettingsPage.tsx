/**
 * 言語設定ページ
 *
 * 2セクション構成：
 * 1. 表示言語（UI言語）- OS設定に遷移
 * 2. コンテンツ言語 - アプリ内で設定
 *    - 選択済みの言語を上部に表示
 *    - 「他の言語を追加」で未選択の言語を展開
 */

import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader, Switch } from '@/shared/ui';
import { CONTENT_LANGUAGES, type ContentLanguageCode, iconSizeNum } from '@/shared/config';
import { useI18n, LOCALE_NAMES, type SupportedLocale } from '@/shared/lib/i18n';
import { useContentLanguagesPreference } from '@/entities/user/api';

// セクションヘッダー
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-xs font-medium text-on-surface-variant uppercase px-4 pt-6 pb-2">
      {title}
    </Text>
  );
}

// コンテンツ言語選択アイテム（トグルスイッチ）
interface ContentLanguageItemProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

function ContentLanguageItem({ label, isSelected, onToggle, isLast }: ContentLanguageItemProps) {
  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${
        !isLast ? 'border-b-hairline border-outline-variant' : ''
      }`}
    >
      <Text className="text-base text-on-surface">
        {label}
      </Text>
      <Switch
        checked={isSelected}
        onCheckedChange={onToggle}
      />
    </View>
  );
}

// locale から ContentLanguageCode へのマッピング
function localeToContentLanguage(locale: SupportedLocale): ContentLanguageCode {
  // cn, tw は zh にマッピング
  if (locale === 'cn' || locale === 'tw') {
    return 'zh';
  }
  return locale as ContentLanguageCode;
}

export function LanguageSettingsPage() {
  const { t, locale } = useI18n();
  const {
    effectiveContentLanguages,
    setContentLanguages,
    isAuthenticated,
  } = useContentLanguagesPreference();

  const [isExpanded, setIsExpanded] = useState(false);

  // メイン言語（localeに対応するContentLanguageCode）
  const mainLanguage = localeToContentLanguage(locale);

  // ページ表示時点での選択済み言語を記録（操作中は変わらない）
  const [initialSelectedLanguages] = useState(() => {
    const selected = effectiveContentLanguages.filter((code) =>
      Object.keys(CONTENT_LANGUAGES).includes(code)
    );
    // メイン言語を先頭に
    return [
      ...selected.filter((code) => code === mainLanguage),
      ...selected.filter((code) => code !== mainLanguage),
    ];
  });

  // 追加言語（ページ表示時点で未選択だったもの）
  const additionalLanguages = useMemo(() => {
    return (Object.keys(CONTENT_LANGUAGES) as ContentLanguageCode[]).filter(
      (code) => !initialSelectedLanguages.includes(code)
    );
  }, [initialSelectedLanguages]);

  // 言語のトグル
  const handleLanguageToggle = (code: ContentLanguageCode) => {
    if (effectiveContentLanguages.includes(code)) {
      // OFFにする（他に選択されている言語がある場合のみ）
      const otherLanguages = effectiveContentLanguages.filter((l) => l !== code);
      if (otherLanguages.length > 0) {
        setContentLanguages(otherLanguages);
      }
      // 他に言語がない場合はOFFにできない（最低1つは必要）
    } else {
      // ONにする
      setContentLanguages([...effectiveContentLanguages, code]);
    }
  };

  // OS設定を開く
  const handleOpenOSSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        t('common.error'),
        Platform.OS === 'ios'
          ? t('settings.openSettingsErrorIOS')
          : t('settings.openSettingsErrorAndroid')
      );
    }
  };

  // 現在の表示言語名
  const currentLocaleName = LOCALE_NAMES[locale] || locale;

  // コンテンツ言語のラベル取得
  const getContentLanguageLabel = (code: ContentLanguageCode): string => {
    const lang = CONTENT_LANGUAGES[code];
    return t(lang.labelKey);
  };

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('settings.language')} showBackButton />

      <ScrollView className="flex-1">
        {/* 表示言語セクション */}
        <SectionHeader title={t('settings.displayLanguage')} />
        <View className="bg-surface">
          <Pressable
            onPress={handleOpenOSSettings}
            className="flex-row items-center px-4 py-4 border-b-hairline border-outline-variant active:bg-secondary"
          >
            <View className="flex-1">
              <Text className="text-base text-on-surface">
                {currentLocaleName}
              </Text>
              <Text className="text-sm text-on-surface-variant mt-1">
                {t('settings.displayLanguageDescription')}
              </Text>
            </View>
            <Ionicons
              name="open-outline"
              size={iconSizeNum.md}
              className="text-on-surface-variant"
            />
          </Pressable>
        </View>
        <Text className="text-xs text-on-surface-variant px-4 pt-2">
          {t('settings.displayLanguageHint')}
        </Text>

        {/* コンテンツ言語セクション - 多言語対応後に有効化 */}
        {/*
        <SectionHeader title={t('settings.contentLanguage')} />
        <View className="bg-surface">
          {initialSelectedLanguages.map((code, index) => {
            const isLastInitial = index === initialSelectedLanguages.length - 1;
            const isLastOverall = isLastInitial && additionalLanguages.length === 0;
            return (
              <ContentLanguageItem
                key={code}
                label={getContentLanguageLabel(code)}
                isSelected={effectiveContentLanguages.includes(code)}
                onToggle={() => handleLanguageToggle(code)}
                isLast={isLastOverall}
              />
            );
          })}

          {additionalLanguages.length > 0 && (
            <>
              <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                className={`flex-row items-center px-4 py-3 active:bg-secondary ${
                  isExpanded ? 'border-b-hairline border-outline-variant' : ''
                }`}
              >
                <Text className="text-base text-primary">
                  {t('settings.addOtherLanguages')}
                </Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={iconSizeNum.sm}
                  className="text-primary"
                  style={{ marginLeft: 4 }}
                />
              </Pressable>

              {isExpanded &&
                additionalLanguages.map((code, index) => (
                  <ContentLanguageItem
                    key={code}
                    label={getContentLanguageLabel(code)}
                    isSelected={effectiveContentLanguages.includes(code)}
                    onToggle={() => handleLanguageToggle(code)}
                    isLast={index === additionalLanguages.length - 1}
                  />
                ))}
            </>
          )}
        </View>
        <Text className="text-xs text-on-surface-variant px-4 pt-2">
          {t('settings.contentLanguageHint')}
        </Text>

        {!isAuthenticated && (
          <View className="mx-4 mt-6 p-4 bg-warning-container rounded-lg">
            <Text className="text-sm text-on-warning-container">
              {t('settings.loginRequiredForContentLanguage')}
            </Text>
          </View>
        )}
        */}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
