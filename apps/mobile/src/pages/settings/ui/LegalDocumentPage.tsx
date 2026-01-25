/**
 * 法的文書表示ページ（利用規約・プライバシーポリシー）
 *
 * マークダウン形式のテキストを表示
 * サーバー（Supabase）から規約を取得
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/config';
import { PageHeader } from '@/shared/ui';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useI18n } from '@/shared/lib/i18n';
import {
  getCurrentTermsVersions,
  type TermsType,
  type TermsVersion,
  type TermsLocale,
} from '@/shared/api/supabase';
import { formatLocalizedDate } from '@/shared/lib/utils';
import { log } from '@/shared/config/logger';

interface LegalDocumentPageProps {
  type: TermsType;
  onBack?: () => void;
}

export function LegalDocumentPage({ type, onBack }: LegalDocumentPageProps) {
  const { t, locale } = useI18n();
  const isDarkMode = useIsDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<TermsVersion | null>(null);

  const title = type === 'terms_of_service' ? t('settings.termsOfService') : t('settings.privacyPolicy');

  // サーバーから規約を取得（現在の言語で）
  useEffect(() => {
    async function fetchDocument() {
      try {
        setIsLoading(true);
        setError(null);
        const terms = await getCurrentTermsVersions(locale as TermsLocale);
        const doc = type === 'terms_of_service' ? terms.termsOfService : terms.privacyPolicy;
        setDocument(doc);
      } catch (err) {
        log.error('[LegalDocumentPage] 規約の取得に失敗:', err);
        setError(t('settings.termsLoadError'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocument();
  }, [type, locale]);

  // ローディング中
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={title} onBack={onBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-on-surface-variant mt-4">
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  // エラー時
  if (error || !document) {
    return (
      <View className="flex-1 bg-surface">
        <PageHeader title={title} onBack={onBack} />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="warning-outline"
            size={48}
            color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
          />
          <Text className="text-on-surface text-center mt-4 mb-6">
            {error || t('settings.termsNotFound')}
          </Text>
          <Pressable
            onPress={() => {
              setIsLoading(true);
              setError(null);
              getCurrentTermsVersions(locale as TermsLocale)
                .then((terms) => {
                  const doc = type === 'terms_of_service' ? terms.termsOfService : terms.privacyPolicy;
                  setDocument(doc);
                })
                .catch((err) => {
                  log.error('[LegalDocumentPage] 規約の取得に失敗:', err);
                  setError(t('settings.termsLoadError'));
                })
                .finally(() => setIsLoading(false));
            }}
            className="bg-primary py-3 px-6 rounded-full"
          >
            <Text className="text-white font-semibold">{t('common.retry')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // マークダウンをシンプルにパースして表示
  const renderContent = () => {
    const lines = document.content.trim().split('\n');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // 空行
      if (!trimmedLine) {
        return <View key={index} className="h-3" />;
      }

      // H1（タイトル）- 前後に広めの余白、施行日をその下に表示
      if (trimmedLine.startsWith('# ')) {
        return (
          <View key={index} className="mt-6 mb-5">
            <Text className="text-2xl font-bold text-on-surface text-center">
              {trimmedLine.slice(2)}
            </Text>
            <Text className="text-sm text-on-surface-variant text-center mt-2">
              {t('settings.effectiveDate', { date: formatLocalizedDate(new Date(document.effective_at)) })}
            </Text>
          </View>
        );
      }

      // H2（## ）
      if (trimmedLine.startsWith('## ')) {
        return (
          <Text
            key={index}
            className="text-xl font-bold text-on-surface mt-6 mb-3"
          >
            {trimmedLine.slice(3)}
          </Text>
        );
      }

      // H3（### ）
      if (trimmedLine.startsWith('### ')) {
        return (
          <Text
            key={index}
            className="text-lg font-semibold text-on-surface mt-4 mb-2"
          >
            {trimmedLine.slice(4)}
          </Text>
        );
      }

      // 区切り線（---）
      if (trimmedLine === '---') {
        return (
          <View
            key={index}
            className="h-px bg-border-light my-6"
          />
        );
      }

      // リスト項目（- ）
      if (trimmedLine.startsWith('- ')) {
        return (
          <View key={index} className="flex-row mb-1 pl-2">
            <Text className="text-on-surface mr-2">•</Text>
            <Text className="flex-1 text-base text-on-surface leading-6">
              {formatInlineText(trimmedLine.slice(2))}
            </Text>
          </View>
        );
      }

      // 番号付きリスト（1. など）
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);
      if (numberedMatch && numberedMatch[1] && numberedMatch[2]) {
        return (
          <View key={index} className="flex-row mb-1 pl-2">
            <Text className="text-on-surface mr-2 w-6">
              {numberedMatch[1]}.
            </Text>
            <Text className="flex-1 text-base text-on-surface leading-6">
              {formatInlineText(numberedMatch[2])}
            </Text>
          </View>
        );
      }

      // 通常のテキスト
      return (
        <Text
          key={index}
          className="text-base text-on-surface leading-6 mb-2"
        >
          {formatInlineText(trimmedLine)}
        </Text>
      );
    });
  };

  // インラインの太字（**text**）を処理
  const formatInlineText = (text: string): string => {
    // 太字マーカーを削除（React Nativeでは複雑なので簡略化）
    return text.replace(/\*\*([^*]+)\*\*/g, '$1');
  };

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={title} onBack={onBack} />
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={true}
      >
        {renderContent()}
        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
