/**
 * サインアップページ
 *
 * FSD: pages/auth/ui
 */

import { OAuthButtons, SignUpForm } from '@/features/auth';
import { useI18n } from '@/shared/lib/i18n';
import { PageHeader } from '@/shared/ui';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { APP_ICON_BASE64 } from '@/shared/config/app-icon';

interface SignUpPageProps {
  onSuccess?: () => void;
  onNavigateToSignIn?: () => void;
}

/**
 * サインアップページ
 * SignUpFormフィーチャーを使用してサインアップ画面を構成
 */
export function SignUpPage({ onSuccess, onNavigateToSignIn }: SignUpPageProps) {
  const { t } = useI18n();

  return (
    <View className="flex-1 bg-surface">
      <PageHeader title={t('auth.createAccountTitle')} />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 24 }}
        extraScrollHeight={20}
      >
        {/* アプリアイコン */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: APP_ICON_BASE64 }}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
            transition={0}
          />
        </View>

        {/* OAuth認証ボタン */}
        <OAuthButtons onSuccess={onSuccess} mode="signup" />

        {/* 区切り線 */}
        <View className="flex-row items-center my-6 px-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-sm text-on-surface-variant">{t('auth.or')}</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Email/Password サインアップフォーム */}
        <SignUpForm />

        {/* サインインへの誘導 */}
        {onNavigateToSignIn && (
          <View className="flex-row justify-center items-center mt-6 px-6">
            <Text className="text-on-surface-variant text-sm">
              {t('auth.hasAccount')}
            </Text>
            <TouchableOpacity onPress={onNavigateToSignIn}>
              <Text className="text-blue-600 text-sm font-semibold ml-1">
                {t('auth.signInLink')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}
