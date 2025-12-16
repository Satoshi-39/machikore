/**
 * 法的文書表示ページ（利用規約・プライバシーポリシー）
 *
 * マークダウン形式のテキストを表示
 * サーバー（Supabase）から規約を取得
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/shared/ui';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import {
  getCurrentTermsVersions,
  type TermsType,
  type TermsVersion,
} from '@/shared/api/supabase';

interface LegalDocumentPageProps {
  type: TermsType;
  onBack?: () => void;
}

export function LegalDocumentPage({ type, onBack }: LegalDocumentPageProps) {
  const isDarkMode = useIsDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<TermsVersion | null>(null);

  const title = type === 'terms_of_service' ? '利用規約' : 'プライバシーポリシー';

  // サーバーから規約を取得
  useEffect(() => {
    async function fetchDocument() {
      try {
        setIsLoading(true);
        setError(null);
        const terms = await getCurrentTermsVersions();
        const doc = type === 'terms_of_service' ? terms.termsOfService : terms.privacyPolicy;
        setDocument(doc);
      } catch (err) {
        console.error('規約の取得に失敗:', err);
        setError('規約の読み込みに失敗しました。インターネット接続を確認してください。');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocument();
  }, [type]);

  // ローディング中
  if (isLoading) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={title} onBack={onBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">
            読み込み中...
          </Text>
        </View>
      </View>
    );
  }

  // エラー時
  if (error || !document) {
    return (
      <View className="flex-1 bg-surface dark:bg-dark-surface">
        <PageHeader title={title} onBack={onBack} />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="warning-outline"
            size={48}
            color={isDarkMode ? colors.dark.foregroundMuted : colors.light.foregroundMuted}
          />
          <Text className="text-foreground dark:text-dark-foreground text-center mt-4 mb-6">
            {error || '規約が見つかりませんでした'}
          </Text>
          <Pressable
            onPress={() => {
              setIsLoading(true);
              setError(null);
              getCurrentTermsVersions()
                .then((terms) => {
                  const doc = type === 'terms_of_service' ? terms.termsOfService : terms.privacyPolicy;
                  setDocument(doc);
                })
                .catch((err) => {
                  console.error('規約の取得に失敗:', err);
                  setError('規約の読み込みに失敗しました。インターネット接続を確認してください。');
                })
                .finally(() => setIsLoading(false));
            }}
            className="bg-primary py-3 px-6 rounded-full"
          >
            <Text className="text-white font-semibold">再試行</Text>
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

      // H1（# ）
      if (trimmedLine.startsWith('# ')) {
        return (
          <Text
            key={index}
            className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-4"
          >
            {trimmedLine.slice(2)}
          </Text>
        );
      }

      // H2（## ）
      if (trimmedLine.startsWith('## ')) {
        return (
          <Text
            key={index}
            className="text-xl font-bold text-foreground dark:text-dark-foreground mt-6 mb-3"
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
            className="text-lg font-semibold text-foreground dark:text-dark-foreground mt-4 mb-2"
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
            className="h-px bg-border-light dark:bg-dark-border-light my-6"
          />
        );
      }

      // リスト項目（- ）
      if (trimmedLine.startsWith('- ')) {
        return (
          <View key={index} className="flex-row mb-1 pl-2">
            <Text className="text-foreground dark:text-dark-foreground mr-2">•</Text>
            <Text className="flex-1 text-base text-foreground dark:text-dark-foreground leading-6">
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
            <Text className="text-foreground dark:text-dark-foreground mr-2 w-6">
              {numberedMatch[1]}.
            </Text>
            <Text className="flex-1 text-base text-foreground dark:text-dark-foreground leading-6">
              {formatInlineText(numberedMatch[2])}
            </Text>
          </View>
        );
      }

      // 通常のテキスト
      return (
        <Text
          key={index}
          className="text-base text-foreground dark:text-dark-foreground leading-6 mb-2"
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
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <PageHeader title={title} onBack={onBack} />
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={true}
      >
        {/* バージョン情報 */}
        <View className="mb-4 pb-3 border-b border-border-light dark:border-dark-border-light">
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted">
            バージョン {document.version}
          </Text>
          <Text className="text-xs text-foreground-muted dark:text-dark-foreground-muted">
            施行日: {new Date(document.effective_at).toLocaleDateString('ja-JP')}
          </Text>
        </View>
        {renderContent()}
        {/* 下部余白 */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
