/**
 * スポット詳細画面
 *
 * URL: /spots/:id
 * スポットの詳細を表示
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: SpotDetailPageを作成して置き換え
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">スポット詳細</Text>
        <Text className="text-sm text-gray-400 mt-2">ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
