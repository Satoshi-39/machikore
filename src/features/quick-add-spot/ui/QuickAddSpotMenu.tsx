/**
 * クイック追加メニュー
 *
 * FABの近くに表示されるスポット追加メニュー
 * - 現在地を登録
 * - 地図でピン刺し
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickAddSpotMenuProps {
  visible: boolean;
  onClose: () => void;
  onCurrentLocation: () => void;
  onMapPin: () => void;
}

export function QuickAddSpotMenu({
  visible,
  onClose,
  onCurrentLocation,
  onMapPin,
}: QuickAddSpotMenuProps) {
  if (!visible) return null;

  return (
    <>
      {/* 背景オーバーレイ（タップで閉じる） */}
      <Pressable
        className="absolute inset-0 z-40"
        onPress={onClose}
      />

      {/* メニュー（FABの上に表示） */}
      <View className="absolute bottom-24 right-6 z-50">
        <View className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ minWidth: 200 }}>
          {/* 現在地を登録 */}
          <Pressable
            onPress={onCurrentLocation}
            className="flex-row items-center px-4 py-3 border-b border-gray-100 active:bg-blue-50"
          >
            <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3">
              <Ionicons name="navigate" size={18} color="white" />
            </View>
            <Text className="text-base font-semibold text-gray-900">
              今ここを登録
            </Text>
          </Pressable>

          {/* 地図でピン刺し */}
          <Pressable
            onPress={onMapPin}
            className="flex-row items-center px-4 py-3 active:bg-gray-50"
          >
            <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center mr-3">
              <Ionicons name="pin" size={18} color="white" />
            </View>
            <Text className="text-base font-semibold text-gray-900">
              地図でピン刺し
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
