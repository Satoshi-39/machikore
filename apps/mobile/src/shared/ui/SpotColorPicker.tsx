/**
 * SpotColorPicker コンポーネント
 *
 * スポットの色を選択するためのUI
 * スポット作成/編集フォームで使用
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPOT_COLORS, type SpotColor } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

interface SpotColorPickerProps {
  selectedColor: SpotColor;
  onColorChange: (color: SpotColor) => void;
}

const SPOT_COLOR_KEYS = Object.keys(SPOT_COLORS) as SpotColor[];

export function SpotColorPicker({
  selectedColor,
  onColorChange,
}: SpotColorPickerProps) {
  const isDarkMode = useIsDarkMode();

  return (
    <View className="flex-row justify-between">
      {SPOT_COLOR_KEYS.map((colorKey) => {
        const colorConfig = SPOT_COLORS[colorKey];
        const isSelected = selectedColor === colorKey;
        const isWhite = colorKey === 'white';

        return (
          <Pressable
            key={colorKey}
            onPress={() => onColorChange(colorKey)}
          >
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isSelected ? 'border-2 border-primary' : ''
              }`}
              style={{
                backgroundColor: colorConfig.color,
                // 白色の場合はボーダーを追加
                borderWidth: isWhite && !isSelected ? 1 : isSelected ? 2 : 0,
                borderColor: isWhite && !isSelected
                  ? (isDarkMode ? '#4B5563' : '#D1D5DB')
                  : isSelected
                    ? undefined // border-primary が適用される
                    : 'transparent',
              }}
            >
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={isWhite ? '#374151' : '#FFFFFF'}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
