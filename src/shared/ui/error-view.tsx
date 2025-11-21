/**
 * エラー表示コンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';

interface ErrorViewProps {
  error: Error | string;
  variant?: 'fullscreen' | 'inline';
}

export function ErrorView({ error, variant = 'fullscreen' }: ErrorViewProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  if (variant === 'inline') {
    return (
      <View className="py-8 items-center px-5">
        <Text className="text-3xl mb-2">❌</Text>
        <Text className="text-sm text-red-600 text-center">{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-5xl mb-4">❌</Text>
      <Text className="text-xl font-bold text-red-500 mb-2">エラーが発生しました</Text>
      <Text className="text-sm text-gray-600 text-center">{errorMessage}</Text>
    </View>
  );
}
