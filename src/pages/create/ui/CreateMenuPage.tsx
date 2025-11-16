/**
 * 作成メニューページ（モーダル）
 *
 * 作成できるコンテンツの選択肢を表示
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CreateMenuPageProps {
  onCreateMap?: () => void;
  onCreateSpot?: () => void;
  onCreatePost?: () => void;
  onClose?: () => void;
}

export function CreateMenuPage({ onCreateMap, onCreateSpot, onCreatePost, onClose }: CreateMenuPageProps) {
  const slideAnim = useRef(new Animated.Value(300)).current; // 初期位置: 画面外

  useEffect(() => {
    // マウント時にスライドアップアニメーション
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  return (
    <View className="flex-1 justify-end bg-black/50">
      {/* 背景タップで閉じる */}
      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={onClose}
      />

      {/* モーダルコンテンツ（アニメーション） */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <SafeAreaView className="bg-white rounded-t-3xl shadow-2xl" edges={['bottom']}>
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
        <View className="px-5 py-8">
          <View className="flex-row justify-center gap-12">
            {/* マップ作成 */}
            <TouchableOpacity
              onPress={onCreateMap}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="map" size={32} color="#FFFFFF" />
              </View>
              <Text className="text-base font-semibold text-gray-800">
                マップ
              </Text>
            </TouchableOpacity>

            {/* スポット作成 */}
            <TouchableOpacity
              onPress={onCreateSpot}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="location" size={32} color="#FFFFFF" />
              </View>
              <Text className="text-base font-semibold text-gray-800">
                スポット
              </Text>
            </TouchableOpacity>

            {/* 投稿作成 */}
            <TouchableOpacity
              onPress={onCreatePost}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="create-outline" size={32} color="#FFFFFF" />
              </View>
              <Text className="text-base font-semibold text-gray-800">
                投稿
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      </Animated.View>
    </View>
  );
}
