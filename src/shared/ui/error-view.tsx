/**
 * エラー表示コンポーネント
 */

import React from 'react';
import { View, Text } from 'react-native';

interface ErrorViewProps {
  error: Error;
}

export function ErrorView({ error }: ErrorViewProps) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-5xl mb-4">❌</Text>
      <Text className="text-xl font-bold text-red-500 mb-2">エラーが発生しました</Text>
      <Text className="text-sm text-gray-600 text-center">{error.message}</Text>
    </View>
  );
}
