/**
 * ドロップダウンフィールド
 *
 * react-native-dropdown-pickerを使用したドロップダウン選択フィールド
 */

import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { colors, fontSizeNum, borderRadiusNum } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

export interface DropdownOption<T extends ValueType = string> {
  value: T;
  label: string;
}

interface DropdownFieldProps<T extends ValueType = string> {
  label: string;
  value: T | null;
  placeholder: string;
  options: DropdownOption<T>[];
  onSelect: (value: T | null) => void;
  disabled?: boolean;
  zIndex?: number;
  zIndexInverse?: number;
}

export function DropdownField<T extends ValueType = string>({
  label,
  value,
  placeholder,
  options,
  onSelect,
  disabled = false,
  zIndex = 1000,
  zIndexInverse = 1000,
}: DropdownFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const isDarkMode = useIsDarkMode();

  // ドロップダウン用のアイテムに変換
  const items = options.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const handleChange = useCallback(
    (callback: (prev: T | null) => T | null) => {
      const newValue = callback(value);
      onSelect(newValue);
    },
    [value, onSelect]
  );

  // テーマに応じた色を取得
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View className="mb-4" style={{ zIndex }}>
      <Text className="text-sm font-medium text-on-surface mb-2">
        {label}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        maxHeight={200}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.outline,
          borderRadius: borderRadiusNum.md,
          minHeight: 48,
          opacity: disabled ? 0.6 : 1,
        }}
        dropDownContainerStyle={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.outline,
          borderRadius: borderRadiusNum.md,
        }}
        textStyle={{
          fontSize: fontSizeNum.base,
          color: themeColors['on-surface'],
        }}
        placeholderStyle={{
          color: themeColors['on-surface-variant'],
        }}
        listItemContainerStyle={{
          height: 48,
        }}
        selectedItemContainerStyle={{
          backgroundColor: `${colors.light.primary}15`,
        }}
      />
    </View>
  );
}
