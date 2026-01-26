/**
 * OAuth認証ボタンUI
 *
 * FSD: features/auth/ui
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, iconSizeNum } from '@/shared/config';
import { useOAuthSignIn } from '../model/use-oauth-sign-in';
import { useIsDarkMode } from '@/shared/lib/providers';

interface OAuthButtonsProps {
  onSuccess?: () => void;
  mode: 'signup' | 'signin';
}

export function OAuthButtons({ onSuccess, mode }: OAuthButtonsProps) {
  const { signInWithOAuth, loadingProvider, error } = useOAuthSignIn({ mode });
  const isDarkMode = useIsDarkMode();
  const appleIconColor = isDarkMode ? colors.component.oauth['apple-dark'] : colors.component.oauth['apple-light'];

  const handleGooglePress = async () => {
    const result = await signInWithOAuth('google');
    // 認証成功時のみonSuccessを呼ぶ
    // キャンセル時は何もしない（ダイアログが閉じるだけ）
    if (result.status === 'success') {
      onSuccess?.();
    }
  };

  const handleApplePress = async () => {
    const result = await signInWithOAuth('apple');
    // 認証成功時のみonSuccessを呼ぶ
    // キャンセル時は何もしない（ダイアログが閉じるだけ）
    if (result.status === 'success') {
      onSuccess?.();
    }
  };

  return (
    <View className="w-full px-6">
      {/* エラーメッセージ */}
      {error && (
        <View className="mb-4 p-4 bg-red-50 rounded-lg">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}

      {/* Googleボタン */}
      <TouchableOpacity
        onPress={handleGooglePress}
        className="w-full py-4 px-6 rounded-lg border-thin border-outline bg-surface mb-3 flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        {loadingProvider === 'google' ? (
          <ActivityIndicator color={colors.component.oauth.google} />
        ) : (
          <>
            <Ionicons name="logo-google" size={iconSizeNum.md} color={colors.component.oauth.google} />
            <Text className="text-on-surface-variant text-base font-semibold ml-3">
              Googleで続ける
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Appleボタン（iOSのみ） */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={handleApplePress}
          className="w-full py-4 px-6 rounded-lg border-thin border-outline bg-surface flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          {loadingProvider === 'apple' ? (
            <ActivityIndicator color={appleIconColor} />
          ) : (
            <>
              <Ionicons name="logo-apple" size={iconSizeNum.md} color={appleIconColor} />
              <Text className="text-on-surface-variant text-base font-semibold ml-3">
                Appleで続ける
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
