/**
 * 作成メニューページ（モーダル）
 *
 * 作成できるコンテンツの選択肢を表示
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';

interface CreateMenuPageProps {
  onCreateMap?: () => void;
  onCreateSpot?: () => void;
  onCreateBlog?: () => void;
  onClose?: () => void;
}

export function CreateMenuPage({ onCreateMap, onCreateSpot, onCreateBlog, onClose }: CreateMenuPageProps) {
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

  const handleClose = () => {
    // 閉じるアニメーション（下にスライド）
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // アニメーション完了後にモーダルを閉じる
      onClose?.();
    });
  };

  return (
    <View className="flex-1 justify-end bg-black/50">
      {/* 背景タップで閉じる */}
      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={handleClose}
      />

      {/* モーダルコンテンツ（アニメーション） */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View className="bg-white rounded-t-3xl shadow-2xl px-5 pt-8 pb-10">
          {/* メニュー */}
          <View className="flex-row justify-center gap-12">
            {/* マップ作成 */}
            <TouchableOpacity
              onPress={() => {
                onCreateMap?.();
                handleClose();
              }}
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
              onPress={() => {
                onCreateSpot?.();
                handleClose();
              }}
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

            {/* ブログ作成 */}
            <TouchableOpacity
              onPress={() => {
                onCreateBlog?.();
                handleClose();
              }}
              className="items-center"
              activeOpacity={0.7}
            >
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="reader-outline" size={32} color="#FFFFFF" />
              </View>
              <Text className="text-base font-semibold text-gray-800">
                ブログ
              </Text>
            </TouchableOpacity>
          </View>
      </View>
      </Animated.View>
    </View>
  );
}
