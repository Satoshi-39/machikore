/**
 * SpotColorPicker コンポーネント
 *
 * スポットの色を選択するためのUI
 * スポット作成/編集フォームで使用
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, SPOT_COLORS, type SpotColor, iconSizeNum } from '@/shared/config';
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
  const themeColors = isDarkMode ? colors.dark : colors.light;

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
                  ? themeColors['outline-variant']
                  : isSelected
                    ? undefined // border-primary が適用される
                    : 'transparent',
              }}
            >
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={iconSizeNum.sm}
                  color={isWhite ? themeColors['on-surface'] : themeColors.surface}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
