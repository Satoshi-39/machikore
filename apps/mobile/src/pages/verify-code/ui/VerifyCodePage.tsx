/**
 * OTP認証コード入力ページ
 *
 * FSD: pages/verify-code/ui
 * メールアドレスに送信された6桁コードを入力して認証
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { verifyOtpCode, sendOtpCode } from '@/shared/api/supabase/auth';
import { colors } from '@/shared/config';
import { log } from '@/shared/config/logger';
import { useI18n } from '@/shared/lib/i18n';
import { useIsDarkMode } from '@/shared/lib/providers';

interface VerifyCodePageProps {
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export function VerifyCodePage({ email, onSuccess, onBack }: VerifyCodePageProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRef = useRef<TextInput>(null);

  // 画面表示時に入力欄にフォーカス
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 再送信クールダウン
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // コード入力ハンドラ
  const handleCodeChange = (text: string) => {
    const sanitized = text.replace(/\D/g, '').slice(0, 6);
    setCode(sanitized);
    setError(null);
  };

  // 認証実行
  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyOtpCode(email, code);

      if (!result.success) {
        throw result.error;
      }

      log.info('[VerifyCode] 認証成功');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.invalidCode');
      setError(errorMessage);
      log.error('[VerifyCode] 認証エラー:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // コード再送信
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      const result = await sendOtpCode(email);

      if (!result.success) {
        throw result.error;
      }

      log.info('[VerifyCode] コード再送信成功');
      setResendCooldown(60); // 60秒のクールダウン
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.resendFailed');
      setError(errorMessage);
      log.error('[VerifyCode] 再送信エラー:', err);
    } finally {
      setIsResending(false);
    }
  };

  const isCodeValid = code.length === 6;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface dark:bg-dark-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ヘッダー */}
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b border-border-light dark:border-dark-border-light"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity onPress={onBack} className="w-10 -ml-1 p-1">
          <Ionicons name="chevron-back" size={28} color={isDarkMode ? colors.dark.foregroundSecondary : colors.text.secondary} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground dark:text-dark-foreground">
          {t('auth.verify')}
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* 説明 */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-4">
            <Ionicons name="mail" size={32} color={colors.primary.DEFAULT} />
          </View>
          <Text className="text-base text-foreground-secondary dark:text-dark-foreground-secondary text-center leading-6">
            {t('auth.codeSentTo', { email })}
          </Text>
        </View>

        {/* エラーメッセージ */}
        {error && (
          <View className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Text className="text-red-600 dark:text-red-400 text-sm text-center">{error}</Text>
          </View>
        )}

        {/* コード入力 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2 text-center">
            {t('auth.authCode')}
          </Text>
          <TextInput
            ref={inputRef}
            className="w-full px-4 py-4 border border-border dark:border-dark-border rounded-xl bg-surface dark:bg-dark-surface text-2xl text-foreground dark:text-dark-foreground text-center tracking-[0.5em] font-semibold"
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isVerifying}
            autoFocus
          />
        </View>

        {/* 認証ボタン */}
        <TouchableOpacity
          className={`w-full py-4 rounded-xl ${
            isCodeValid && !isVerifying ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          onPress={handleVerify}
          disabled={!isCodeValid || isVerifying}
          style={
            isCodeValid && !isVerifying
              ? {
                  shadowColor: colors.primary.DEFAULT,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }
              : undefined
          }
        >
          {isVerifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-base font-semibold">
              {t('auth.verify')}
            </Text>
          )}
        </TouchableOpacity>

        {/* 再送信ボタン */}
        <View className="mt-6 items-center">
          <TouchableOpacity
            onPress={handleResend}
            disabled={isResending || resendCooldown > 0}
            className="py-2"
          >
            {isResending ? (
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
            ) : resendCooldown > 0 ? (
              <Text className="text-foreground-muted dark:text-dark-foreground-muted text-sm">
                {t('auth.resendCode')} ({resendCooldown}s)
              </Text>
            ) : (
              <Text className="text-primary text-sm font-medium">
                {t('auth.resendCode')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 別のメールアドレスを使用 */}
        <View className="mt-4 items-center">
          <TouchableOpacity onPress={onBack} disabled={isVerifying} className="py-2">
            <Text className="text-foreground-secondary dark:text-dark-foreground-secondary text-sm">
              {t('auth.useAnotherEmail')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
