/**
 * OTP認証コード入力ページ
 *
 * FSD: pages/verify-code/ui
 * メールアドレスに送信された6桁コードを入力して認証
 */

import React, { useState, useRef, useEffect } from 'react';
import { colors, iconSizeNum } from '@/shared/config';
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
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ヘッダー */}
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b border-outline-variant"
        style={{ paddingTop: insets.top + 12 }}
      >
        <TouchableOpacity onPress={onBack} className="w-10 -ml-1 p-1">
          <Ionicons name="chevron-back" size={iconSizeNum.xl} color={isDarkMode ? colors.dark['on-surface-variant'] : colors.light["on-surface-variant"]} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-on-surface">
          {t('auth.verify')}
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* 説明 */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-primary-container items-center justify-center mb-4">
            <Ionicons name="mail" size={iconSizeNum.xl} className="text-primary" />
          </View>
          <Text className="text-base text-on-surface-variant text-center leading-6">
            {t('auth.codeSentTo', { email })}
          </Text>
        </View>

        {/* エラーメッセージ */}
        {error && (
          <View className="mb-4 p-4 bg-error-container rounded-lg">
            <Text className="text-error text-sm text-center">{error}</Text>
          </View>
        )}

        {/* コード入力 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-on-surface-variant mb-2 text-center">
            {t('auth.authCode')}
          </Text>
          <TextInput
            ref={inputRef}
            className="w-full px-4 py-4 border border-outline rounded-xl bg-surface text-2xl text-on-surface text-center tracking-[0.5em] font-semibold"
            placeholder="000000"
            placeholderTextColor={colors.light['on-surface-variant']}
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
            isCodeValid && !isVerifying ? 'bg-primary' : 'bg-secondary'
          }`}
          onPress={handleVerify}
          disabled={!isCodeValid || isVerifying}
          style={
            isCodeValid && !isVerifying
              ? {
                  shadowColor: colors.light.primary,
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
              <ActivityIndicator size="small" className="text-primary" />
            ) : resendCooldown > 0 ? (
              <Text className="text-on-surface-variant text-sm">
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
            <Text className="text-on-surface-variant text-sm">
              {t('auth.useAnotherEmail')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
