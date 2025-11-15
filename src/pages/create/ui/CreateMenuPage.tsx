/**
 * 作成メニューページ（モーダル）
 *
 * 作成できるコンテンツの選択肢を表示
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CreateMenuPageProps {
  onCreateMap?: () => void;
  onClose?: () => void;
}

export function CreateMenuPage({ onCreateMap, onClose }: CreateMenuPageProps) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ヘッダー */}
      <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">作成</Text>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* メニュー */}
      <View className="p-5">
        <TouchableOpacity
          onPress={onCreateMap}
          className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-3"
          activeOpacity={0.7}
        >
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
            <Ionicons name="map" size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              マップを作成する
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              訪れた場所を記録してマップを作成
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
