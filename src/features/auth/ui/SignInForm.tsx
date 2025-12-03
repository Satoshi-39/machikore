/**
 * サインインフォームUI
 *
 * FSD: features/auth-sign-in/ui
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '../model/use-sign-in';

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { signIn, isLoading, error } = useSignIn();

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    try {
      await signIn({ email, password });
      onSuccess?.();
    } catch (err) {
      // エラーはuseSignInフック内で処理される
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

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
          メールアドレスで続ける
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
            <View className="mb-4 p-4 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          {/* メールアドレス入力 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
              メールアドレス
            </Text>
            <TextInput
              className="w-full px-4 py-3 border border-border dark:border-dark-border rounded-lg bg-surface dark:bg-dark-surface text-base"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* パスワード入力 */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
              パスワード
            </Text>
            <TextInput
              className="w-full px-4 py-3 border border-border dark:border-dark-border rounded-lg bg-surface dark:bg-dark-surface text-base"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          {/* サインインボタン */}
          <TouchableOpacity
            className={`w-full py-4 rounded-lg ${
              isFormValid && !isLoading ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                サインイン
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
