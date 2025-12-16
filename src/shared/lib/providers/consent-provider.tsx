/**
 * 同意チェックプロバイダー
 *
 * 利用規約・プライバシーポリシーへの同意状況を管理
 * 未同意の場合はオンボーディングまたは再同意画面を表示
 */

import React, { useState, useEffect, type ReactNode } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSettingsStore } from '@/shared/lib/store';
import { useUserStore } from '@/entities/user/model';
import { colors } from '@/shared/config';
import {
  getCurrentTermsVersions,
  getUserLatestAgreement,
} from '@/shared/api/supabase';
import { OnboardingPage } from '@/pages/onboarding';
import { TermsUpdatePage } from '@/pages/terms-update';

// 同意画面の種類
type ConsentScreenType = 'none' | 'onboarding' | 'terms-update';

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const user = useUserStore((state) => state.user);
  const { hasAgreedToVersion, agreeToTerms, agreedTermsVersion } = useAppSettingsStore();

  const [isCheckingTerms, setIsCheckingTerms] = useState(true);
  const [consentScreen, setConsentScreen] = useState<ConsentScreenType>('none');

  // サーバーから現在の規約バージョンを取得して、同意状況をチェック
  useEffect(() => {
    async function checkTermsAgreement() {
      try {
        const currentTerms = await getCurrentTermsVersions();
        const termsVersion = currentTerms.termsOfService?.version ?? '';
        const privacyVersion = currentTerms.privacyPolicy?.version ?? '';

        // まずローカルの同意バージョンをチェック
        const hasLocalAgreement = hasAgreedToVersion(termsVersion, privacyVersion);

        if (hasLocalAgreement) {
          // ローカルに最新の同意があれば同意画面をスキップ
          setConsentScreen('none');
          setIsCheckingTerms(false);
          return;
        }

        // ログイン済みユーザーの場合、サーバーの同意情報もチェック
        if (user?.id) {
          const serverAgreement = await getUserLatestAgreement(user.id);

          if (
            serverAgreement &&
            serverAgreement.terms_version === termsVersion &&
            serverAgreement.privacy_version === privacyVersion
          ) {
            // サーバーに最新の同意があればローカルに同期してスキップ
            agreeToTerms(termsVersion, privacyVersion);
            setConsentScreen('none');
            setIsCheckingTerms(false);
            return;
          }
        }

        // 同意が必要
        // 初回（ローカルに同意記録なし）か更新（古い同意記録あり）かを判定
        const isFirstTime = !agreedTermsVersion;
        setConsentScreen(isFirstTime ? 'onboarding' : 'terms-update');
      } catch (err) {
        console.error('規約バージョンの取得に失敗:', err);
        // エラー時はオンボーディングを表示（安全側に倒す）
        setConsentScreen('onboarding');
      } finally {
        setIsCheckingTerms(false);
      }
    }

    checkTermsAgreement();
  }, [hasAgreedToVersion, user?.id, agreeToTerms, agreedTermsVersion]);

  // 同意完了時
  const handleConsentComplete = () => {
    setConsentScreen('none');
  };

  // 規約チェック中
  if (isCheckingTerms) {
    return (
      <View className="flex-1 justify-center items-center bg-surface dark:bg-dark-surface">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  // 初回オンボーディング表示
  if (consentScreen === 'onboarding') {
    return <OnboardingPage onComplete={handleConsentComplete} />;
  }

  // 規約更新時の再同意画面表示
  if (consentScreen === 'terms-update') {
    return <TermsUpdatePage onComplete={handleConsentComplete} />;
  }

  // 同意済み - 子コンポーネントを表示
  return <>{children}</>;
}
