/**
 * OTPサインインフォームUI
 *
 * FSD: features/auth/ui
 *
 * メールアドレス入力 → OTPコード送信 → 認証コード入力画面へ遷移
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendOtpCode } from '@/shared/api/supabase/auth';
import { checkEmailExists, checkEmailHasPendingDeletion } from '@/shared/api/supabase';
import { colors, iconSizeNum } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';
import { Button, Text as ButtonText, buttonTextVariants } from '@/shared/ui';

export function SignInForm() {
  const { t } = useI18n();
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const [email, setEmail] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // メール送信
  const handleSendCode = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      // メールアドレスが登録されているかチェック
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        setError(t('auth.emailNotRegistered'));
        setIsLoading(false);
        return;
      }

      // 退会手続き中のメールアドレスかチェック
      const hasPendingDeletion = await checkEmailHasPendingDeletion(email);
      if (hasPendingDeletion) {
        setError(t('auth.accountPendingDeletion'));
        setIsLoading(false);
        return;
      }

      const result = await sendOtpCode(email);

      if (!result.success) {
        throw result.error;
      }

      log.info('[Auth] OTPコード送信成功:', email);
      // 認証コード入力画面へ遷移
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.sendCodeFailed');
      setError(errorMessage);
      log.error('[Auth] OTPコード送信エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = email.length > 0 && email.includes('@');

  return (
    <View className="w-full px-6">
      {/* 開閉トグルボタン */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 px-6 rounded-lg border border-outline bg-surface flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="mail-outline" size={iconSizeNum.md} color={themeColors['on-surface-variant']} />
        <Text className="text-on-surface-variant text-base font-semibold ml-3">
          {t('auth.continueWithEmail')}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={iconSizeNum.md}
          color={themeColors['on-surface-variant']}
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      {/* 展開時のフォーム */}
      {isExpanded && (
        <View className="mt-4">
          {/* エラーメッセージ */}
          {error && (
            <View className="mb-4 p-4 bg-error-container rounded-lg">
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* メールアドレス入力 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-on-surface-variant mb-2">
              {t('auth.email')}
            </Text>
            <TextInput
              className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-base text-on-surface"
              placeholder="your@email.com"
              placeholderTextColor={colors.light['on-surface-variant']}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <Button onPress={handleSendCode} disabled={!isEmailValid || isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ButtonText className={buttonTextVariants()}>
                {t('auth.sendCode')}
              </ButtonText>
            )}
          </Button>
        </View>
      )}
    </View>
  );
}
