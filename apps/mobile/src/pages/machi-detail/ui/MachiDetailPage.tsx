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
import { colors, iconSizeNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface MachiDetailPageProps {
  machiId: string;
}

export function MachiDetailPage({ machiId }: MachiDetailPageProps) {
  const router = useRouter();
  const isDarkMode = useIsDarkMode();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  // TODO: 街のデータ取得
  // const { data: machi } = useMachi(machiId);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      {/* ヘッダー */}
      <View className="flex-row items-center px-4 py-3 border-b-thin border-outline">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-secondary mr-3"
        >
          <Ionicons name="arrow-back" size={iconSizeNum.lg} color={themeColors['on-surface-variant']} />
        </Pressable>
        <Text className="text-xl font-bold text-on-surface flex-1">街詳細</Text>
      </View>

      <ScrollView className="flex-1">
        {/* プレースホルダー */}
        <View className="p-6">
          <View className="items-center py-12">
            <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-4">
              <Ionicons name="storefront" size={iconSizeNum['2xl']} color={themeColors['on-surface-variant']} />
            </View>
            <Text className="text-xl font-bold text-on-surface mb-2">
              {machiId}
            </Text>
            <Text className="text-sm text-on-surface-variant text-center">
              街の詳細情報は今後実装予定です
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
