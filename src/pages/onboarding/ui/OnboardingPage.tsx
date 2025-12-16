/**
 * オンボーディングページ
 *
 * 初回起動時に利用規約・プライバシーポリシーへの同意を求める
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettingsStore } from '@/shared/lib/store';
import { useIsDarkMode } from '@/shared/lib/providers';
import { colors } from '@/shared/config';
import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE_LAST_UPDATED,
  PRIVACY_POLICY_LAST_UPDATED,
} from '@/shared/content';

interface OnboardingPageProps {
  onComplete: () => void;
}

type DocumentType = 'terms' | 'privacy' | null;

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const agreeToTerms = useAppSettingsStore((state) => state.agreeToTerms);

  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<DocumentType>(null);

  const canAgree = hasReadTerms && hasReadPrivacy;

  const handleAgree = () => {
    agreeToTerms();
    onComplete();
  };

  const handleViewDocument = (type: DocumentType) => {
    setViewingDocument(type);
    if (type === 'terms') {
      setHasReadTerms(true);
    } else if (type === 'privacy') {
      setHasReadPrivacy(true);
    }
  };

  // 文書表示モード
  if (viewingDocument) {
    const content = viewingDocument === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY;
    const title = viewingDocument === 'terms' ? '利用規約' : 'プライバシーポリシー';

    return (
      <View
        className="flex-1 bg-surface dark:bg-dark-surface"
        style={{ paddingTop: insets.top }}
      >
        {/* ヘッダー */}
        <View className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-border-light">
          <Pressable
            onPress={() => setViewingDocument(null)}
            className="p-2 -ml-2"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? colors.dark.foreground : colors.primary.DEFAULT}
            />
          </Pressable>
          <Text className="flex-1 text-lg font-bold text-foreground dark:text-dark-foreground ml-2">
            {title}
          </Text>
        </View>

        {/* コンテンツ */}
        <ScrollView className="flex-1 px-4 py-4">
          {renderMarkdownContent(content)}
          <View className="h-8" />
        </ScrollView>

        {/* 確認ボタン */}
        <View
          className="px-4 py-4 border-t border-border-light dark:border-dark-border-light"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Pressable
            onPress={() => setViewingDocument(null)}
            className="bg-primary py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-base">確認しました</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // メイン画面
  return (
    <View
      className="flex-1 bg-surface dark:bg-dark-surface"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      >
        {/* アイコンとタイトル */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="map" size={40} color={colors.primary.DEFAULT} />
          </View>
          <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">
            街コレへようこそ
          </Text>
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center">
            ご利用の前に、利用規約とプライバシーポリシーをご確認ください
          </Text>
        </View>

        {/* 利用規約 */}
        <Pressable
          onPress={() => handleViewDocument('terms')}
          className="flex-row items-center bg-background dark:bg-dark-background p-4 rounded-xl mb-3"
        >
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
              利用規約
            </Text>
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
              最終更新: {TERMS_OF_SERVICE_LAST_UPDATED}
            </Text>
          </View>
          {hasReadTerms ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary.DEFAULT} />
          ) : (
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          )}
        </Pressable>

        {/* プライバシーポリシー */}
        <Pressable
          onPress={() => handleViewDocument('privacy')}
          className="flex-row items-center bg-background dark:bg-dark-background p-4 rounded-xl mb-6"
        >
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground dark:text-dark-foreground">
              プライバシーポリシー
            </Text>
            <Text className="text-sm text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
              最終更新: {PRIVACY_POLICY_LAST_UPDATED}
            </Text>
          </View>
          {hasReadPrivacy ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary.DEFAULT} />
          ) : (
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          )}
        </Pressable>

        {/* 説明テキスト */}
        {!canAgree && (
          <Text className="text-sm text-foreground-muted dark:text-dark-foreground-muted text-center mb-4">
            両方の文書を確認すると同意ボタンが有効になります
          </Text>
        )}
      </ScrollView>

      {/* 同意ボタン */}
      <View
        className="px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleAgree}
          disabled={!canAgree}
          className={`py-4 rounded-xl items-center ${
            canAgree ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <Text
            className={`font-bold text-base ${
              canAgree ? 'text-white' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            同意してはじめる
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// マークダウンをシンプルにパースして表示
function renderMarkdownContent(content: string) {
  const lines = content.trim().split('\n');

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return <View key={index} className="h-3" />;
    }

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

    if (trimmedLine === '---') {
      return (
        <View
          key={index}
          className="h-px bg-border-light dark:bg-dark-border-light my-6"
        />
      );
    }

    if (trimmedLine.startsWith('- ')) {
      return (
        <View key={index} className="flex-row mb-1 pl-2">
          <Text className="text-foreground dark:text-dark-foreground mr-2">•</Text>
          <Text className="flex-1 text-base text-foreground dark:text-dark-foreground leading-6">
            {trimmedLine.slice(2).replace(/\*\*([^*]+)\*\*/g, '$1')}
          </Text>
        </View>
      );
    }

    const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch && numberedMatch[1] && numberedMatch[2]) {
      return (
        <View key={index} className="flex-row mb-1 pl-2">
          <Text className="text-foreground dark:text-dark-foreground mr-2 w-6">
            {numberedMatch[1]}.
          </Text>
          <Text className="flex-1 text-base text-foreground dark:text-dark-foreground leading-6">
            {numberedMatch[2].replace(/\*\*([^*]+)\*\*/g, '$1')}
          </Text>
        </View>
      );
    }

    return (
      <Text
        key={index}
        className="text-base text-foreground dark:text-dark-foreground leading-6 mb-2"
      >
        {trimmedLine.replace(/\*\*([^*]+)\*\*/g, '$1')}
      </Text>
    );
  });
}
