/**
 * サインアップフォームUI
 *
 * FSD: features/auth-sign-up/ui
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '../model/use-sign-up';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { signUp, isLoading, error } = useSignUp();

  const handleSubmit = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      await signUp({ email, password, username });
      onSuccess?.();
    } catch (err) {
      // エラーはuseSignUpフック内で処理される
    }
  };

  const isFormValid =
    username.length > 0 &&
    email.length > 0 &&
    password.length >= 6 &&
    password === confirmPassword;

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

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
        <ScrollView className="mt-4">
          {/* エラーメッセージ */}
          {error && (
            <View className="mb-4 p-4 bg-red-50 rounded-lg">
              <Text className="text-red-600 text-sm">{error}</Text>
            </View>
          )}

          {/* ユーザー名入力 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
              ユーザー名
            </Text>
            <TextInput
              className="w-full px-4 py-3 border border-border dark:border-dark-border rounded-lg bg-surface dark:bg-dark-surface text-base"
              placeholder="username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

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
          <View className="mb-4">
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
            <Text className="text-xs text-foreground-secondary dark:text-dark-foreground-secondary mt-1">
              6文字以上で入力してください
            </Text>
          </View>

          {/* パスワード確認入力 */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground-secondary dark:text-dark-foreground-secondary mb-2">
              パスワード（確認）
            </Text>
            <TextInput
              className={`w-full px-4 py-3 border rounded-lg bg-surface dark:bg-dark-surface text-base ${
                passwordMismatch ? 'border-red-500' : 'border-border dark:border-dark-border'
              }`}
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
            {passwordMismatch && (
              <Text className="text-xs text-red-500 mt-1">
                パスワードが一致しません
              </Text>
            )}
          </View>

          {/* サインアップボタン */}
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
                アカウント作成
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
