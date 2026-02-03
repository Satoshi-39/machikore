/**
 * ピン刺しモード時のオーバーレイUI
 *
 * マップの中央に固定ピンを表示し、確定・キャンセルボタンを提供
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPOT_COLORS, colors, getSpotColorStroke, DEFAULT_SPOT_COLOR, iconSizeNum, borderWidthNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';
import { LocationPinIcon } from '@/shared/ui';
import type { PinDropOverlayProps } from '../model/types';

export function PinDropOverlay({ onConfirm, onCancel, spotColor = DEFAULT_SPOT_COLOR }: PinDropOverlayProps) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const colorConfig = SPOT_COLORS[spotColor];
  const pinColor = colorConfig.color;

  // ピンの縁取り色（白/グレーテーマの場合に必要）
  const pinStrokeColor = getSpotColorStroke(spotColor, isDarkMode);

  // 確定ボタンの色（スポットカラー）
  // 白テーマの場合は文字色を黒にする
  const isWhiteTheme = spotColor === 'white';
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const confirmButtonTextColor = isWhiteTheme ? themeColors['on-surface'] : colors.light['on-primary'];

  // 閉じるボタンの色（ライト/ダークモード対応）
  const closeButtonColor = isDarkMode ? colors.primitive.gray[300] : colors.primitive.gray[600];

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
        <LocationPinIcon size={iconSizeNum['3xl']} color={pinColor} strokeColor={pinStrokeColor} />
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
            <Ionicons name="close" size={iconSizeNum.lg} color={closeButtonColor} />
          </Pressable>
        </View>

        {/* 確定ボタン */}
        <Pressable
          onPress={onConfirm}
          className="px-12 py-3 rounded-full active:opacity-80"
          style={{
            backgroundColor: pinColor,
            // 白テーマの場合は枠線を追加
            ...(isWhiteTheme && { borderWidth: borderWidthNum.thin, borderColor: themeColors['outline-variant'] }),
          }}
        >
          <Text style={{ color: confirmButtonTextColor }} className="font-semibold text-base">
            この位置で登録
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
