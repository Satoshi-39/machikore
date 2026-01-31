/**
 * 利用規約同意ステップ
 *
 * オンボーディングStep1: 利用規約・プライバシーポリシーへの同意を求める
 * Sign-in Wrap方式: リンクを表示し、「はじめる」ボタンで同意とみなす
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { colors, EXTERNAL_LINKS } from '@/shared/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorView } from '@/shared/ui';
import { useAppSettingsStore } from '@/shared/lib/store';
import { useUserStore } from '@/entities/user/model';
import {
  getCurrentTermsVersions,
  recordTermsAgreement,
  type TermsVersion,
} from '@/shared/api/supabase';
import { log } from '@/shared/config/logger';

// アプリアイコン
const AppIcon = require('@assets/images/machikore13.png');

interface TermsAgreementStepProps {
  onComplete: () => void;
}

export function TermsAgreementStep({ onComplete }: TermsAgreementStepProps) {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const agreeToTerms = useAppSettingsStore((state) => state.agreeToTerms);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ローディング・エラー
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 規約データ（バージョン管理用）
  const [termsOfService, setTermsOfService] = useState<TermsVersion | null>(null);
  const [privacyPolicy, setPrivacyPolicy] = useState<TermsVersion | null>(null);

  // 規約バージョンをサーバーから取得
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
        setError('読み込みに失敗しました。インターネット接続を確認してください。');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTerms();
  }, []);

  // アプリ内ブラウザで開く
  const openTerms = () => {
    WebBrowser.openBrowserAsync(EXTERNAL_LINKS.TERMS);
  };

  const openPrivacy = () => {
    WebBrowser.openBrowserAsync(EXTERNAL_LINKS.PRIVACY);
  };

  const handleAgree = async () => {
    if (isSubmitting || !termsOfService || !privacyPolicy) return;

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
        <ActivityIndicator size="large" color={colors.light.primary} />
        <Text className="text-on-surface-variant mt-4">
          読み込み中...
        </Text>
      </View>
    );
  }

  // リトライ
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    getCurrentTermsVersions()
      .then((terms) => {
        setTermsOfService(terms.termsOfService);
        setPrivacyPolicy(terms.privacyPolicy);
      })
      .catch((err) => {
        log.error('[OnboardingPage] 規約の取得に失敗:', err);
        setError('読み込みに失敗しました。インターネット接続を確認してください。');
      })
      .finally(() => setIsLoading(false));
  };

  // エラー時
  if (error || !termsOfService || !privacyPolicy) {
    return (
      <View
        className="flex-1 bg-surface"
        style={{ paddingTop: insets.top }}
      >
        <ErrorView
          message={error || undefined}
          onRetry={handleRetry}
          variant="fullscreen"
        />
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
      </View>

      {/* 同意ボタンと規約リンク */}
      <View
        className="px-8 mb-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleAgree}
          disabled={isSubmitting}
          className={`py-4 rounded-full items-center ${
            !isSubmitting ? 'bg-primary' : 'bg-secondary'
          }`}
          style={!isSubmitting ? {
            shadowColor: colors.light.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          } : {}}
        >
          <Text
            className={`font-semibold text-base ${
              !isSubmitting ? 'text-white' : 'text-on-surface-variant'
            }`}
          >
            {isSubmitting ? '処理中...' : 'はじめる'}
          </Text>
        </Pressable>

        {/* Sign-in Wrap: 規約リンクと同意文言 */}
        <Text className="text-sm text-on-surface-variant text-center mt-6 leading-6">
          「はじめる」をタップすることで、{'\n'}
          <Text className="text-primary underline" onPress={openTerms}>
            利用規約
          </Text>
          と
          <Text className="text-primary underline" onPress={openPrivacy}>
            プライバシーポリシー
          </Text>
          に{'\n'}同意したものとみなされます。
        </Text>
      </View>
    </View>
  );
}

