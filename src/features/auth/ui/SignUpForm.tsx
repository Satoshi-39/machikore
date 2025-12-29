/**
 * OTPサインアップフォームUI
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
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';

export function SignUpForm() {
  const { t } = useI18n();
  const router = useRouter();
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
      const result = await sendOtpCode(email);

      if (!result.success) {
        throw result.error;
      }

      log.info('[Auth] OTPコード送信成功:', email);
      // 認証コード入力画面へ遷移
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'メール送信に失敗しました';
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
        className="w-full py-4 px-6 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        <Ionicons name="mail-outline" size={20} color="#6B7280" />
        <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-base font-semibold ml-3">
          {t('auth.signUpWithEmail')}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      {/* 展開時のフォーム */}
      {isExpanded && (
        <View className="mt-4">
          {/* エラーメッセージ */}
          {error && (
            <View className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
            </View>
          )}

          {/* メールアドレス入力 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
              {t('auth.email')}
            </Text>
            <TextInput
              className="w-full px-4 py-3 border border-border dark:border-dark-border rounded-lg bg-surface dark:bg-dark-surface text-base text-foreground dark:text-dark-foreground"
              placeholder="your@email.com"
              placeholderTextColor="#9CA3AF"
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

          <TouchableOpacity
            className={`w-full py-4 rounded-lg ${
              isEmailValid && !isLoading ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onPress={handleSendCode}
            disabled={!isEmailValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                {t('auth.sendSignUpCode')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
