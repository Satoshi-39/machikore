/**
 * 規約更新時の再同意ページ
 *
 * 利用規約・プライバシーポリシーが更新された場合に表示
 * 初回オンボーディングより簡潔なUI
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettingsStore } from '@/shared/lib/store';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useUserStore } from '@/entities/user/model';
import { colors } from '@/shared/config';
import {
  getCurrentTermsVersions,
  recordTermsAgreement,
  type TermsVersion,
} from '@/shared/api/supabase';
import { TermsMarkdownRenderer } from '@/shared/ui';
import { log } from '@/shared/config/logger';

interface TermsUpdatePageProps {
  onComplete: () => void;
}

type DocumentType = 'terms' | 'privacy' | null;

export function TermsUpdatePage({ onComplete }: TermsUpdatePageProps) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const user = useUserStore((state) => state.user);
  const agreeToTerms = useAppSettingsStore((state) => state.agreeToTerms);

  // 同意チェックボックス
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ローディング・エラー
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 文書表示モード
  const [viewingDocument, setViewingDocument] = useState<DocumentType>(null);

  // 規約データ
  const [termsOfService, setTermsOfService] = useState<TermsVersion | null>(null);
  const [privacyPolicy, setPrivacyPolicy] = useState<TermsVersion | null>(null);

  // 規約をサーバーから取得
  useEffect(() => {
    async function fetchTerms() {
      try {
        setIsLoading(true);
        setError(null);
        const terms = await getCurrentTermsVersions();
        setTermsOfService(terms.termsOfService);
        setPrivacyPolicy(terms.privacyPolicy);
      } catch (err) {
        log.error('[TermsUpdatePage] 規約の取得に失敗:', err);
        setError('規約の読み込みに失敗しました。インターネット接続を確認してください。');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTerms();
  }, []);

  const handleCloseDocument = () => {
    setViewingDocument(null);
  };

  const handleAgree = async () => {
    if (!isAgreed || isSubmitting || !termsOfService || !privacyPolicy) return;

    setIsSubmitting(true);
    try {
      // サーバーに同意を記録（ユーザーがログイン済みの場合）
      if (user?.id) {
        await recordTermsAgreement(
          user.id,
          termsOfService.id,
          privacyPolicy.id
        );
      }

      // ローカルに保存（バージョン情報を含む）
      agreeToTerms(termsOfService.version, privacyPolicy.version);

      onComplete();
    } catch (err) {
      log.error('[TermsUpdatePage] 同意の記録に失敗:', err);
      // エラーでもローカルには保存して続行（後でサーバー同期）
      agreeToTerms(termsOfService.version, privacyPolicy.version);
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ローディング中
  if (isLoading) {
    return (
      <View
        className="flex-1 bg-surface dark:bg-dark-surface items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary mt-4">
          読み込み中...
        </Text>
      </View>
    );
  }

  // エラー時
  if (error || !termsOfService || !privacyPolicy) {
    return (
      <View
        className="flex-1 bg-surface dark:bg-dark-surface items-center justify-center px-6"
        style={{ paddingTop: insets.top }}
      >
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
                setTermsOfService(terms.termsOfService);
                setPrivacyPolicy(terms.privacyPolicy);
              })
              .catch((err) => {
                log.error('[TermsUpdatePage] 規約の取得に失敗:', err);
                setError('規約の読み込みに失敗しました。インターネット接続を確認してください。');
              })
              .finally(() => setIsLoading(false));
          }}
          className="bg-primary py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">再試行</Text>
        </Pressable>
      </View>
    );
  }

  // 文書表示画面
  if (viewingDocument) {
    const content = viewingDocument === 'terms' ? termsOfService.content : privacyPolicy.content;
    const title = viewingDocument === 'terms' ? '利用規約' : 'プライバシーポリシー';
    const effectiveAt = viewingDocument === 'terms' ? termsOfService.effective_at : privacyPolicy.effective_at;

    return (
      <View
        className="flex-1 bg-surface dark:bg-dark-surface"
        style={{ paddingTop: insets.top }}
      >
        {/* ヘッダー */}
        <View className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-border-light">
          {/* 左側：戻るボタン */}
          <Pressable
            onPress={handleCloseDocument}
            className="w-10"
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={isDarkMode ? colors.dark.foreground : colors.light.foreground}
            />
          </Pressable>
          {/* 中央：タイトル */}
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
              {title}
            </Text>
          </View>
          {/* 右側スペーサー */}
          <View className="w-10" />
        </View>

        {/* コンテンツ */}
        <ScrollView className="flex-1 px-4 py-4">
          <TermsMarkdownRenderer content={content} effectiveAt={effectiveAt} />
          <View className="h-8" />
        </ScrollView>
      </View>
    );
  }

  // メイン画面
  return (
    <View
      className="flex-1 bg-surface dark:bg-dark-surface"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 justify-center px-6">
        {/* 更新通知 */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="document-text" size={32} color={colors.primary.DEFAULT} />
          </View>
          <Text className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">
            規約が更新されました
          </Text>
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center">
            続けてご利用いただくには、{'\n'}更新された規約への同意が必要です
          </Text>
        </View>

        {/* 規約リンク */}
        <View className="mb-6 bg-surface-secondary dark:bg-dark-surface-secondary rounded-xl">
          {/* 利用規約 */}
          <Pressable
            onPress={() => setViewingDocument('terms')}
            className="flex-row items-center py-4 px-4 border-b border-border-light dark:border-dark-border-light"
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={isDarkMode ? colors.dark.foregroundMuted : colors.light.foregroundMuted}
            />
            <Text className="flex-1 text-base text-foreground dark:text-dark-foreground ml-3">
              利用規約
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? colors.dark.foregroundMuted : colors.light.foregroundMuted}
            />
          </Pressable>

          {/* プライバシーポリシー */}
          <Pressable
            onPress={() => setViewingDocument('privacy')}
            className="flex-row items-center py-4 px-4"
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={isDarkMode ? colors.dark.foregroundMuted : colors.light.foregroundMuted}
            />
            <Text className="flex-1 text-base text-foreground dark:text-dark-foreground ml-3">
              プライバシーポリシー
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? colors.dark.foregroundMuted : colors.light.foregroundMuted}
            />
          </Pressable>
        </View>

        {/* 同意チェックボックス */}
        <View className="mb-8">
          <Pressable
            onPress={() => setIsAgreed(!isAgreed)}
            className="flex-row items-center py-4"
          >
            <View
              className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                isAgreed
                  ? 'bg-primary border-primary'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {isAgreed && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text className="flex-1 text-base leading-6 text-foreground dark:text-dark-foreground">
              更新された利用規約とプライバシーポリシーに同意します
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 同意ボタン */}
      <View
        className="px-6 pb-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleAgree}
          disabled={!isAgreed || isSubmitting}
          className={`py-4 rounded-full items-center ${
            isAgreed && !isSubmitting ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          style={isAgreed && !isSubmitting ? {
            shadowColor: colors.primary.DEFAULT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          } : {}}
        >
          <Text
            className={`font-semibold text-base ${
              isAgreed && !isSubmitting ? 'text-white' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {isSubmitting ? '処理中...' : '続ける'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

