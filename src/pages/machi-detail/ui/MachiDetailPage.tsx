/**
 * 街詳細ページ
 *
 * 特定の街の詳細情報を表示
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

interface MachiDetailPageProps {
  machiId: string;
}

export function MachiDetailPage({ machiId }: MachiDetailPageProps) {
  const router = useRouter();

  // TODO: 街のデータ取得
  // const { data: machi } = useMachi(machiId);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ヘッダー */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </Pressable>
        <Text className="text-xl font-bold text-gray-900 flex-1">街詳細</Text>
      </View>

      <ScrollView className="flex-1">
        {/* プレースホルダー */}
        <View className="p-6">
          <View className="items-center py-12">
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Ionicons name="storefront" size={40} color="#6B7280" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              {machiId}
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              街の詳細情報は今後実装予定です
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
