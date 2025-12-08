/**
 * ピン刺しモード時のオーバーレイUI
 *
 * マップの中央に固定ピンを表示し、確定・キャンセルボタンを提供
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { USER_MAP_THEME_COLORS, type UserMapThemeColor } from '@/shared/config';
import { LocationPinIcon } from '@/shared/ui';

interface PinDropOverlayProps {
  /** 確定ボタン押下時 */
  onConfirm: () => void;
  /** キャンセルボタン押下時 */
  onCancel: () => void;
  /** マップのテーマカラー */
  themeColor: UserMapThemeColor;
}

export function PinDropOverlay({ onConfirm, onCancel, themeColor }: PinDropOverlayProps) {
  const insets = useSafeAreaInsets();
  const pinColor = USER_MAP_THEME_COLORS[themeColor].color;

  return (
    <View className="absolute inset-0 pointer-events-box-none" pointerEvents="box-none">
      {/* 上部：説明テキスト（ヘッダーの下） */}
      <View
        className="absolute left-0 right-0 items-center"
        style={{ top: insets.top + 100 }}
        pointerEvents="none"
      >
        <View className="bg-black/70 px-4 py-2 rounded-full">
          <Text className="text-white text-sm font-medium">
            地図をドラッグしてピンの位置を調整
          </Text>
        </View>
      </View>

      {/* 中央：固定ピン（マップの中央に表示） */}
      <View
        className="absolute left-1/2 top-1/2 items-center justify-center"
        style={{ transform: [{ translateX: -20 }, { translateY: -40 }] }}
        pointerEvents="none"
      >
        <LocationPinIcon size={40} color={pinColor} />
      </View>

      {/* 下部：確定ボタン + 閉じるボタン */}
      <View
        className="absolute left-0 right-0 items-center px-4"
        style={{ bottom: insets.bottom + 140 }}
      >
        {/* 閉じるボタン（確定ボタンの右上角にくっつく位置） */}
        <View className="absolute -top-7 right-24">
          <Pressable
            onPress={onCancel}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#666" />
          </Pressable>
        </View>

        {/* 確定ボタン */}
        <Pressable
          onPress={onConfirm}
          className="px-12 py-3 rounded-full active:opacity-80"
          style={{ backgroundColor: pinColor }}
        >
          <Text className="text-white font-semibold text-base">
            この位置で登録
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
