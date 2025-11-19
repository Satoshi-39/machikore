/**
 * ピンモードオーバーレイ
 *
 * 地図上でピン刺し時に表示される中央の十字線と確定/キャンセルボタン
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PinModeOverlayProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PinModeOverlay({
  visible,
  onConfirm,
  onCancel,
}: PinModeOverlayProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 items-center justify-center">
      {/* 中央の十字線（タップを透過） */}
      <View className="items-center pointer-events-none">
        <Ionicons name="add" size={48} color="#3B82F6" />
      </View>

      {/* ボタンバー（画面下部） */}
      <View className="absolute bottom-32 left-0 right-0 items-center pointer-events-box-none">
        <View className="bg-white rounded-full shadow-lg px-4 py-3 flex-row items-center">
          {/* 確定ボタン */}
          <Pressable
            onPress={onConfirm}
            className="flex-row items-center active:opacity-70"
          >
            <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
            <Text className="text-blue-500 font-bold text-base ml-2">
              この位置で確定
            </Text>
          </Pressable>

          {/* 区切り線 */}
          <View className="w-px h-5 bg-gray-200 mx-3" />

          {/* 閉じるアイコン */}
          <Pressable
            onPress={onCancel}
            className="active:opacity-50"
          >
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
