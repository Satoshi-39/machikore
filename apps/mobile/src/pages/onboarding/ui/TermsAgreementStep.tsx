/**
 * 利用規約同意ステップ
 *
 * オンボーディングStep1: 利用規約・プライバシーポリシーへの同意を求める
 * 規約はサーバー（Supabase）から取得
 *
 * フロー:
 * 1. 利用規約を読む → 「読んだ」チェックが付く
 * 2. プライバシーポリシーを読む → 「読んだ」チェックが付く
 * 3. 両方読んだら「同意します」チェックボックスが有効になる
 * 4. 「同意します」にチェック → 「はじめる」ボタンが有効になる
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { colors, iconSizeNum } from '@/shared/config';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSettingsStore } from '@/shared/lib/store';
import { useIsDarkMode } from '@/shared/lib/providers';
import { useUserStore } from '@/entities/user/model';
import {
  getCurrentTermsVersions,
  recordTermsAgreement,
  type TermsVersion,
} from '@/shared/api/supabase';
import { TermsMarkdownRenderer } from '@/shared/ui';
import { log } from '@/shared/config/logger';

// アプリアイコン
const AppIcon = require('@assets/images/machikore13.png');

interface TermsAgreementStepProps {
  onComplete: () => void;
}

type DocumentType = 'terms' | 'privacy' | null;

export function TermsAgreementStep({ onComplete }: TermsAgreementStepProps) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const user = useUserStore((state) => state.user);
  const agreeToTerms = useAppSettingsStore((state) => state.agreeToTerms);

  // 読んだかどうかの状態
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);

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

  // 両方読んだかどうか
  const hasBothRead = hasReadTerms && hasReadPrivacy;

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
        log.error('[OnboardingPage] 規約の取得に失敗:', err);
        setError('規約の読み込みに失敗しました。インターネット接続を確認してください。');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTerms();
  }, []);

  // 文書を閉じたときに「読んだ」フラグを立てる
  const handleCloseDocument = () => {
    if (viewingDocument === 'terms') {
      setHasReadTerms(true);
    } else if (viewingDocument === 'privacy') {
      setHasReadPrivacy(true);
    }
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
      log.error('[OnboardingPage] 同意の記録に失敗:', err);
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
        className="flex-1 bg-surface items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="text-on-surface-variant mt-4">
          読み込み中...
        </Text>
      </View>
    );
  }

  // エラー時
  if (error || !termsOfService || !privacyPolicy) {
    return (
      <View
        className="flex-1 bg-surface items-center justify-center px-6"
        style={{ paddingTop: insets.top }}
      >
        <Ionicons
          name="warning-outline"
          size={iconSizeNum['3xl']}
          color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
        />
        <Text className="text-on-surface text-center mt-4 mb-6">
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
                log.error('[OnboardingPage] 規約の取得に失敗:', err);
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
        className="flex-1 bg-surface"
        style={{ paddingTop: insets.top }}
      >
        {/* ヘッダー */}
        <View className="flex-row items-center px-4 py-3 border-b-thin border-outline-variant">
          {/* 左側：戻るボタン */}
          <Pressable
            onPress={handleCloseDocument}
            className="w-10"
          >
            <Ionicons
              name="chevron-back"
              size={iconSizeNum.xl}
              color={isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface']}
            />
          </Pressable>
          {/* 中央：タイトル */}
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-on-surface">
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
      className="flex-1 bg-surface"
      style={{ paddingTop: insets.top }}
    >

      <View className="flex-1 justify-center px-6">
        {/* ロゴとウェルカムメッセージ */}
        <View className="items-center mb-10">
          <Image
            source={AppIcon}
            className="w-24 h-24 rounded-3xl mb-6"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          />
          <Text className="text-3xl font-bold text-on-surface mb-2">
            街コレ
          </Text>
          <Text className="text-base text-on-surface-variant text-center">
            お気に入りの場所を集めて共有しよう
          </Text>
        </View>

        {/* 規約確認エリア */}
        <View className="mb-6">
          {/* 利用規約 */}
          <Pressable
            onPress={() => setViewingDocument('terms')}
            className="flex-row items-center py-4 border-b-thin border-outline-variant"
          >
            <View
              className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                hasReadTerms
                  ? 'bg-green-500'
                  : 'bg-secondary'
              }`}
            >
              {hasReadTerms ? (
                <Ionicons name="checkmark" size={iconSizeNum.sm} color="white" />
              ) : (
                <Text className="text-xs text-on-surface-variant">1</Text>
              )}
            </View>
            <Text className="flex-1 text-base text-on-surface">
              利用規約
            </Text>
            <Ionicons
              name="chevron-forward"
              size={iconSizeNum.md}
              color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
            />
          </Pressable>

          {/* プライバシーポリシー */}
          <Pressable
            onPress={() => setViewingDocument('privacy')}
            className="flex-row items-center py-4 border-b-thin border-outline-variant"
          >
            <View
              className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                hasReadPrivacy
                  ? 'bg-green-500'
                  : 'bg-secondary'
              }`}
            >
              {hasReadPrivacy ? (
                <Ionicons name="checkmark" size={iconSizeNum.sm} color="white" />
              ) : (
                <Text className="text-xs text-on-surface-variant">2</Text>
              )}
            </View>
            <Text className="flex-1 text-base text-on-surface">
              プライバシーポリシー
            </Text>
            <Ionicons
              name="chevron-forward"
              size={iconSizeNum.md}
              color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light['on-surface-variant']}
            />
          </Pressable>
        </View>

        {/* 同意チェックボックス */}
        <View className="mb-8">
          <Pressable
            onPress={() => hasBothRead && setIsAgreed(!isAgreed)}
            disabled={!hasBothRead}
            className={`flex-row items-center py-4 ${!hasBothRead ? 'opacity-50' : ''}`}
          >
            <View
              className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                isAgreed
                  ? 'bg-primary border-primary'
                  : hasBothRead
                    ? 'border-outline'
                    : 'border-outline'
              }`}
            >
              {isAgreed && (
                <Ionicons name="checkmark" size={iconSizeNum.sm} color="white" />
              )}
            </View>
            <Text
              className={`flex-1 text-base leading-6 ${
                hasBothRead
                  ? 'text-on-surface'
                  : 'text-on-surface-variant'
              }`}
            >
              上記の利用規約とプライバシーポリシーに同意します
            </Text>
          </Pressable>

          {/* 補足説明 */}
          <Text className="text-sm text-on-surface-variant leading-5 ml-9">
            続行することで、13歳以上であることを確認し、位置情報やコンテンツの利用について同意したものとみなされます。
          </Text>
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
            isAgreed && !isSubmitting ? 'bg-primary' : 'bg-secondary'
          }`}
          style={isAgreed && !isSubmitting ? {
            shadowColor: colors.light.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          } : {}}
        >
          <Text
            className={`font-semibold text-base ${
              isAgreed && !isSubmitting ? 'text-white' : 'text-on-surface-variant'
            }`}
          >
            {isSubmitting ? '処理中...' : 'はじめる'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

